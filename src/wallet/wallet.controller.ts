import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto, GetByWalletDto, TransferTokenDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';



@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('mother')
  async createMotherWallet(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.createMotherWallet(createWalletDto);
  }

  @Post('facility')
  async createFacilityWallet(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.createFacilityWallet(createWalletDto);
  }

  @Get()
  async getAllWallet(){
    return this.walletService.getAllWallet();
  }

  @Post('token')
  async generateToken(@Body() body: { walletId: string, amount: number }) {
    const { walletId, amount } = body;
    const newBalance = await this.walletService.generateToken(walletId, amount);
    return { newBalance };
  }

  @Get('balance')
  async getWalletBalance(@Query() { walletId}: GetByWalletDto) {
    return this.walletService.getWalletBalance(walletId);
  }


  @Get('user')
  async getWalletByUserId(@Query() { userId}: GetByWalletDto) {
    const wallet = await this.walletService.getWalletByUserId(userId);
    return wallet;
  } 

  @Patch('transfer')
  async transferTokenFromMotherToFacility(
    @Body() transferTokenDto: TransferTokenDto
  ) {
    const { userId, facilityId, amount, phone } = transferTokenDto;
    return this.walletService.transferTokenFromMotherToFacility(userId, facilityId, amount, phone);
  }

  
}
