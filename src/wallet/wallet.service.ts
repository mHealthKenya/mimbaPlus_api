import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';
import { OtpService } from '../otp/otp.service';


@Injectable()
export class WalletService {
  constructor(private readonly prismaService: PrismaService, private otpService: OtpService) {}


  async createMotherWallet(createWalletDto: CreateWalletDto){
    const userId = await this.prismaService.user.findUnique({ where: {id: createWalletDto.userId}})
    
    if(!userId){
      throw new NotFoundException('User Not Found')
    }

    const newWallet = await this.prismaService.wallet.create({ data: {...createWalletDto, balance : 0 }}).then((data) => {
      return data;
    }).catch((err) => {throw new Error(err)})
    return {message: 'Wallet created successfully' ,newWallet};
  }

  async createFacilityWallet(createWalletDto: CreateWalletDto){
    const facilityId = await this.prismaService.facility.findUnique({ where: {id: createWalletDto.facilityId}})
    
    if(!facilityId){
      throw new NotFoundException('Facility Not Found')
    }

    const newWallet = await this.prismaService.wallet.create({ data: {...createWalletDto, balance : 0 }}).then((data) => {
      return data;
    }).catch((err) => {throw new Error(err)})
    return {message: 'Wallet created successfully' ,newWallet};
  }

  async getAllWallet(){
    try{
      const allWallets = await this.prismaService.wallet.findMany()
      return allWallets;
    }catch(error){
      throw new Error(error);
    }
  }

  async getWalletsByUserId(userId: string) {
    try {
      const userWallets = await this.prismaService.wallet.findMany({
        where: { userId: userId },
      });

      if (!userWallets.length) {
        throw new NotFoundException('No wallets found for this user.');
      }
      return userWallets;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async transferTokenFromMotherToFacility(userId: string, facilityId: string, amount: number, phone: string) {
    try {
      const purpose = 'MOTHER TO FACILITY TRANSACTION';
      const otp = await this.otpService.generateOTPFn(userId, phone, purpose);
      const isOtpVerified = await this.otpService.verifyOTP(userId, otp);

      if (!isOtpVerified) {
        throw new Error('Invalid OTP');
      }

      const userWallet = await this.prismaService.wallet.findFirst({ where: { userId: userId } });
      const facilityWallet = await this.prismaService.wallet.findFirst({ where: { facilityId: facilityId } });

      if (!userWallet || !facilityWallet) {
        throw new NotFoundException('User/Facility not found');
      }

      if (userWallet.balance < amount) {
        throw new Error('Insufficient funds');
      }

      const newUserBal = userWallet.balance - amount;
      const newFacilityBal = facilityWallet.balance + amount;

      await this.prismaService.wallet.update({
        where: { id: userWallet.id },
        data: { balance: newUserBal },
      });

      await this.prismaService.wallet.update({
        where: { id: facilityWallet.id },
        data: { balance: newFacilityBal },
      });

      const userTransRecord = await this.prismaService.transaction.create({
        data: {
          userId: userId,
          facilityId: facilityId,
          description: `Payment to ${facilityId}`,
          status: 'pending',
          amount: -amount,
          transactionDate: new Date(),
          type: 'PAYMENT',
        },
      });

      const facilityTransRecord = await this.prismaService.transaction.create({
        data: {
          userId: userId,
          facilityId: facilityId,
          description: `Payment to ${facilityId}`,
          amount: amount,
          status: 'pending',
          type: 'PAYMENT',
          transactionDate: new Date(),
        },
      });

      return {
        userWallet: { ...userWallet, balance: newUserBal },
        facilityWallet: { ...facilityWallet, balance: newFacilityBal },
        userTransRecord,
        facilityTransRecord,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async generateToken(walletId: string, amount: number): Promise<number> {
    const wallet = await this.prismaService.wallet.findUnique({
      where: { id: walletId },
    });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const newBalance = await this.prismaService.wallet.update({
      where: { id: walletId },
      data: { balance: wallet.balance + amount },
    });

    return newBalance.balance;
  }

  async getWalletBalance(walletId: string) {
    try{
      const wallet = await this.prismaService.wallet.findUnique({ where: { id: walletId } });
      if (!wallet) {
        throw new Error('Wallet not found');
      }

    return wallet.balance;
    }catch(error){
      throw new Error(error);
    }
    
  }

  

}
