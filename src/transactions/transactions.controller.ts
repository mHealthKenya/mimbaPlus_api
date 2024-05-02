import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Patch('reversal/:userId/:facilityId/:transactionId')
  async reversalTransfer(
    @Param('userId') userId: string,
    @Param('facilityId') facilityId: string,
    @Param('transactionId') transactionId: string,
  ) {
    return this.transactionsService.reversalTransfer(userId, facilityId, transactionId);
  }

  @Get('facility/:facilityId')
  async facilityTransactionHistory(@Param('facilityId') facilityId: string) {
    return this.transactionsService.facilityTransctionHistory(facilityId);
  }

  @Get('mother/:userId')
  async motherTransactionHistory(@Param('userId') userId: string) {
    return this.transactionsService.motherTransctionHistory(userId);
  }

  @Patch('resetFacility/:facilityId')
  async resetFacilityWalletBalance(@Param('facilityId') facilityId: string) {
    return this.transactionsService.resetFacilityWalletBalance(facilityId);
  }
}
