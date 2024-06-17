import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserRoles } from 'src/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/users/users.service';
import { CreateWalletBaseDto } from './dto/create-walletbase.dto';
import { FindWalletDto } from './dto/find-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletService } from './wallet.service';
import { RequestCodeDto } from './dto/request-code.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApproveTransactionDto } from './dto/approve-transaction.dto';
import { MultiApproveDto } from './dto/multi-approve.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Post('base')
  walletBase(@Body() data: CreateWalletBaseDto) {
    return this.walletService.walletBase(data);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('all')
  findAll() {
    return this.walletService.findAll();
  }

  @Get('mine')
  findMine() {
    return this.walletService.findWalletByUser();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('single')
  getWallet(@Query() data: FindWalletDto) {

    return this.walletService.findWallet(data);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Patch('updatebalance')
  update(@Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.update(updateWalletDto);
  }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Post('requestcode')
  requestCode(@Body() data: RequestCodeDto) {
    return this.walletService.requestCode(data);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Post('transact')
  addPoints(@Body() data: CreateTransactionDto) {
    return this.walletService.createTransaction(data);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Patch('approve')
  approve(@Body() data: ApproveTransactionDto) {
    return this.walletService.approveTransaction(data);
  }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('facility')
  facilityWallet() {
    return this.walletService.facilityWallet();
  }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('facility/transactions')
  facilityPoints() {
    return this.walletService.facilityTransactions();
  }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('facility/all')
  findAllFacilityWallets() {
    return this.walletService.findAllFacilityWallets();
  }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('facility/balance')
  findTotalFacilityBalance() {
    return this.walletService.findTotalFacilityBalance();
  }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('mothers/balance')
  findTotalWalletBalance() {
    return this.walletService.findTotalWalletBalance();
  }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('transactions/paid')
  findAllMothersWallets() {
    return this.walletService.findTotalTransactionsPaid();
  }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('transactions/all')
  findAllUnpaidTransactions() {
    return this.walletService.allTransactions();
  }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Patch('transactions/multiapprove')
  findAllPendingTransactions(@Body() data: MultiApproveDto) {
    return this.walletService.multiApprove(data);
  }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Post('transactions/checkbalance')
  checkPeriodBalance(@Body() data: MultiApproveDto) {
    return this.walletService.checkPeriodBalance(data);
  }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('base')
  getBaseWallet() {
    return this.walletService.getBaseWallet();
  }

}
