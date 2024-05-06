import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';
import { OtpService } from '../otp/otp.service';


@Injectable()
export class WalletService {
  constructor(private readonly prismaService: PrismaService, private otpService: OtpService) {}


  async createWallet(createWalletDto: CreateWalletDto){
    const newWallet = await this.prismaService.wallet.create({ data: {...createWalletDto, balance : 0 }}).then((data) => {
      return data;
    }).catch((err) => {throw new Error(err)})
    return newWallet;
  }

  async getWalletByUserId(userId: string){
    try {
      const userWallet = await this.prismaService.wallet.findUnique({ where: {
        id: userId
      }})
  
      if(!userWallet){
        throw new Error('User wallet not found');
      }
      return userWallet;
    } catch(error){
      throw new Error(error);
    }
    
  }

  async transferTokenFromMotherToFacility(userId: string, facilityId: string, amount: number, phone: string){
    try {
      const puporse = 'MOTHER TO FACITILITY TRANSACTION'
      const otp = await this.otpService.generateOTPFn(userId, phone, puporse)

      const isOtpVerified = await this.otpService.verifyOTP(userId, otp);

      if(!isOtpVerified){
        throw new Error('Invalid OTP')
      }

      const userWallet = await this.prismaService.wallet.findUnique({ where: {
        id: userId
      }})

      const facilityWallet = await this.prismaService.wallet.findUnique({ where: {
        id: facilityId
      }})

      if(!userWallet || !facilityWallet) {throw new NotFoundException('User/Facility not found')}

      if(userWallet.balance < amount) {throw new Error('Insufficient funds')}

      const newUserBal = userWallet.balance - amount;
      const newFacilityBal = facilityWallet.balance + amount;

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

      const userTransRecord = await this.prismaService.transaction.create({
        data: {
          userId: userId,
          facilityId: facilityId,
          description: `Payment to ${facilityId}`,
          status: 'pending',
          amount: -amount,
          transactionDate: new Date(),
          type: TransactionType.PAYMENT,
        }
      })

      const facilityTransRecord = await this.prismaService.transaction.create({
        data: {
          userId: userId,
          facilityId: facilityId,
          description: `Payment to ${facilityId}`,
          amount: -amount,
          status: 'pending',
          type: TransactionType.PAYMENT,
          transactionDate: new Date(),
        }
      })

      return {
        userWallet: {...userWallet, balance: newUserBal},
        facilityWallet: {...facilityWallet, balance: newFacilityBal},
        userTransRecord: userTransRecord,
        facilityTransRecord: facilityTransRecord
      }

    } catch(error) {
      throw new Error(error);
    } 
  }


  async generateToken(userId: string, amount: number): Promise<number> {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const currentBalance = await this.prismaService.wallet.findUnique({ where: { id: userId } });
    let curbal = 0 

    if(currentBalance){
      curbal = currentBalance.balance
    }

    const newBalance = await this.prismaService.wallet.update({
      where: { id: userId },
      data: { balance: curbal + amount },
    })

    
    return newBalance.balance;
  }

  async getWalletBalance(walletId: string) {
    const wallet = await this.prismaService.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return wallet.balance;
  }

  

}