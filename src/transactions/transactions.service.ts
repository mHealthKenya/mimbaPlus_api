import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

enum TransactionType {
  DEPOSIT,
  PAYMENT,
  REVERSAL,
  CHECKOUT
}


@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService,
              private readonly createTransactionDto: CreateTransactionDto
  ){}

  async reversalTransfer(userId: string, facilityId: string, transactionId: string){
    const transaction = await this.prismaService.transaction.findUnique({ where: { id: transactionId} });

    if(!transaction) {
      throw new Error('Transaction not found');
    }

    //check if transaction belong to facility and user id
    if(transaction.userId !== userId || transaction.facilityId !== facilityId){
      throw new Error('Invalid Transaction');
    }

    const reversedTransaction = await this.prismaService.transaction.create({
      data:{
        userId: userId,
        facilityId: facilityId,
        amount: -transaction.amount, // Reverse the amount
        description: `Reversal of transaction ${transactionId}`,
        invoice: transaction.invoice,
        type: 'REVERSAL',
        status: transaction.status,
        transactionDate: transaction.transactionDate,
        
      }
    })

    // update balance
    const userWallet = await this.prismaService.wallet.findUnique({ where: { id: userId } });
    const facilityWallet = await this.prismaService.wallet.findUnique({ where: { id: facilityId } });

    const newUserBal = userWallet.balance + transaction.amount;
    const newFacilityBal = facilityWallet.balance - transaction.amount;

    await this.prismaService.wallet.update({
      where: {
        id: userId
      },
      data: {
        balance: newUserBal
      }
    })

    await this.prismaService.wallet.update({
      where: {
        id: facilityId
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
        userId: 'facility_id_here', // Provide the facility user ID
        amount: -facilityWallet.balance, // Negative balance to indicate a checkout
        description: 'Facility wallet checkout',
        transaction_date: new Date(),
        type: TransactionType.CHECKOUT,
        facilityId: facilityWallet.id,
      },
    });

    return {
      facilityWallet: {...facilityWallet, balance: newFacilityBal}
    }
  }



}
