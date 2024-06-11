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
      throw new Error(error.message);
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

    return {balance: wallet.balance};
    }catch(error){
      throw new Error(error);
    }
    
  }

  async deleteWalletById(walletId: string){
    const item = this.prismaService.wallet.delete({
      where: {
        id: walletId
      }
    })

    return {item, message: 'Wallet Deleted Successfully'}
  }
  

  async getTotalTokensAwarded(walletId: string): Promise<number> {
    const wallet = await this.prismaService.wallet.findUnique({
      where: { id: walletId }
    });

    if(!wallet){
      throw new NotFoundException('Wallet not found')
    }

    const transactions = await this.prismaService.transaction.findMany({
      where: {
        walletId: walletId,
        type: TransactionType.DEPOSIT
      }
    })

    const totalTokensAwared = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    return totalTokensAwared
  }

}
