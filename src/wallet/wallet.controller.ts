import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async createWallet(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.createWallet(createWalletDto);
  }

  @Post()
  async generateToken(userId: string, amount: number) {
    const newBalance = await this.walletService.generateToken(userId, amount);
    return { newBalance };
  }

  @Get('balance/:walletId')
  async getWalletBalance(@Param('walletId') walletId: string) {
    return this.walletService.getWalletBalance(walletId);
  }


  @Get(':userId')
  async getWalletByUserId(@Param('userId') userId: string) {
    const wallet = await this.walletService.getWalletByUserId(userId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  @Patch('transfer/:userId/:phone/:facilityId/:amount')
  async transferTokenFromMotherToFacility(
    @Param('userId') userId: string,
    @Param('facilityId') facilityId: string,
    @Param('amount') amount: number,
    @Param('phone') phone: string
  ) {
    return this.walletService.transferTokenFromMotherToFacility(userId, facilityId, amount, phone);
  }

  
}
