import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto, TansferCompleteDto, TansferRequestDto, TransactionReversalDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';
import { OtpService } from '../otp/otp.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TokenTransferRequestEvent } from 'src/users/events/token-transfer-request';
import { SendsmsService } from '../sendsms/sendsms.service';


@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService,
              private readonly createTransactionDto: CreateTransactionDto,
              private readonly eventEmitter: EventEmitter2,
              private readonly sendSMSservice: SendsmsService
  ){}

 
  async tokenTransferFromMotherToFacilityRequest(transferDTO: TansferRequestDto){
    const purpose = 'MOTHER TO FACILITY TRANSACTION';
    const user = await this.prismaService.wallet.findFirst({where: {userId: transferDTO.userId}})
    if(!user){
      throw new NotFoundException('User Not Found')
    }
    const facility = await this.prismaService.wallet.findFirst({where: {facilityId: transferDTO.facilityId}})
    if(!facility){
      throw new NotFoundException('Facility Not Found')
    }

    const otp = (Math.random() + 1).toString(36).substring(7);
    const newOtp = await this.prismaService.otp.create({
      data: {
        userId: transferDTO.userId,
        otp: otp,
        purpose: purpose
      }
    }).then((data) => {
      this.eventEmitter.emit(
        'token.transfer.request', new TokenTransferRequestEvent(data.userId, transferDTO.phone, data.otp)
      );
      return {
        message: 'OTP successfully sent',
        otp: otp
      }
    }).catch((err) => {
      throw new BadRequestException(err);
    })
    return newOtp
  }

  async tokenTransferFromMotherToFacility(tansferCompeleteDto: TansferCompleteDto){
    const otpExists = await this.prismaService.otp.findFirst({
      where: {
        userId: tansferCompeleteDto.userId,
        otp: tansferCompeleteDto.otp
      }
    })
    if(!otpExists){
      throw new Error('Invalid OTP')
    }

    const userWallet = await this.prismaService.wallet.findFirst({ where: { userId: tansferCompeleteDto.userId } });
    const facilityWallet = await this.prismaService.wallet.findFirst({ where: { facilityId: tansferCompeleteDto.facilityId } });

    if (!userWallet || !facilityWallet) {
      throw new NotFoundException('User/Facility not found');
    }

    if (userWallet.balance < tansferCompeleteDto.amount) {
      throw new Error('Insufficient funds');
    }
    const newUserBal = userWallet.balance - tansferCompeleteDto.amount;
      const newFacilityBal = facilityWallet.balance + tansferCompeleteDto.amount;

      await this.prismaService.wallet.update({
        where: { id: userWallet.id },
        data: { balance: newUserBal },
      });

      await this.prismaService.wallet.update({
        where: { id: facilityWallet.id },
        data: { balance: newFacilityBal },
      });

      const userTransRecord =  this.prismaService.transaction.create({
        data: {
          userId: tansferCompeleteDto.userId,
          facilityId: tansferCompeleteDto.facilityId,
          description: `Payment to ${tansferCompeleteDto.facilityId}`,
          status: 'pending',
          amount: -tansferCompeleteDto.amount,
          transactionDate: new Date(),
          type: 'PAYMENT',
          wallet: {connect: {id: userWallet.id}}
        },
      });

      const facilityTransRecord =  this.prismaService.transaction.create({
        data: {
          userId: tansferCompeleteDto.userId,
          facilityId: tansferCompeleteDto.facilityId,
          description: `Payment to ${tansferCompeleteDto.facilityId}`,
          amount: tansferCompeleteDto.amount,
          status: 'pending',
          type: 'PAYMENT',
          transactionDate: new Date(),
          wallet: { connect: { id: facilityWallet.id } }
        },
      });

      const deleteOTP = this.prismaService.otp.delete({
        where: {
          userId_otp : {
            userId: tansferCompeleteDto.userId,
            otp: tansferCompeleteDto.otp
          }
        }
      })

      return await this.prismaService.$transaction([userTransRecord, facilityTransRecord, deleteOTP])

  }

  async reversalTransfer(transactionReversalDto: TransactionReversalDto){
    const transaction = await this.prismaService.transaction.findUnique({ where: { id: transactionReversalDto.transactionId} });

    if(!transaction) {
      throw new Error('Transaction not found');
    }
   
    //check if transaction belong to facility and user id
    if(transaction.userId !== transactionReversalDto.userId || transaction.facilityId !== transactionReversalDto.facilityId){
      throw new Error('Invalid Transaction');
    }
    const userWallet = await this.prismaService.wallet.findUnique({ where: { id: transactionReversalDto.userId } });
    const facilityWallet = await this.prismaService.wallet.findUnique({ where: { id: transactionReversalDto.facilityId } });

    const reversedTransaction = await this.prismaService.transaction.create({
      data:{
        userId: transactionReversalDto.userId,
        facilityId: transactionReversalDto.facilityId,
        amount: -transaction.amount, // Reverse the amount
        description: `Reversal of transaction ${transactionReversalDto.transactionId}`,
        invoice: transaction.invoice,
        type: 'REVERSAL',
        status: transaction.status,
        transactionDate: transaction.transactionDate,
        wallet: { connect: { id: userWallet.id } }, 
      }
    })

    // update balance
   

    const newUserBal = userWallet.balance + transaction.amount;
    const newFacilityBal = facilityWallet.balance - transaction.amount;

    await this.prismaService.wallet.update({
      where: {
        id: transactionReversalDto.userId
      },
      data: {
        balance: newUserBal
      }
    })

    await this.prismaService.wallet.update({
      where: {
        id: transactionReversalDto.facilityId
      },
      data: {
        balance: newFacilityBal
      }
    })

    return {
      userWallet: {...userWallet, balance: newUserBal},
      facilityWallet: {...facilityWallet, balance: newFacilityBal},
      reversedTransaction: reversedTransaction
    }
  }

  async facilityTransctionHistory(facilityId: string) {
    const transactions = await this.prismaService.transaction
     .findMany({
        where: {
          facilityId,
        },
      })
      if(!transactions){
        throw new Error('No transactions found');
      }
    return transactions;
  }

  async motherTransctionHistory(userId: string){
    const transactions = await this.prismaService.transaction
     .findMany({
        where: {
          userId,
        },
      })
      if(!transactions){
        throw new Error('No transactions found');
      }
    return transactions;
  }

  async resetFacilityWalletBalance(facilityId: string){
    const facilityWallet = await this.prismaService.wallet.findUnique({ where: { id: facilityId } });
    if(!facilityWallet){
      throw new Error('Facility wallet not found');
    }

    const newFacilityBal = 0;

    await this.prismaService.wallet.update({
      where: {
        id: facilityId
      },
      data: {
        balance: newFacilityBal
      }
    })

    await this.prismaService.transaction.create({
      data: {
        userId: 'facility_id_here', 
        amount: -facilityWallet.balance, 
        description: 'Facility wallet checkout',
        status: 'REDEEMED',
        transactionDate: new Date(),
        facilityId: facilityWallet.id,
        type: TransactionType.CASHOUT,
        wallet: { connect: { id: facilityWallet.id } }, 
      },
    });

    return {
      facilityWallet: {...facilityWallet, balance: newFacilityBal}
    }
  }

  @OnEvent('token.transfer.request')
  async handleOTPRequest(data: TokenTransferRequestEvent){
    const {phone} = data

    await this.sendSMSservice.sendSMSFn({
      phoneNumber: phone,
      message: 'You have been sent an OTP for your transaction' + data.otp,
    });
  }
}
