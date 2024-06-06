import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TansferCompleteDto, TansferRequestDto, TransactionReversalDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Patch('reversal')
  async reversalTransfer(
    @Body() transactionReversalDto: TransactionReversalDto
  ) {
    return this.transactionsService.reversalTransfer(transactionReversalDto);
  }

  @Post('trasferRequest')
  async tokenTransferRequest(@Body() tokenTransferDTO: TansferRequestDto){
    return this.transactionsService.tokenTransferFromMotherToFacilityRequest(tokenTransferDTO);
  }

  @Patch('completeTransfer')
  async completeTransfer(@Body() tansferCompeleteDto: TansferCompleteDto){
    return this.transactionsService.tokenTransferFromMotherToFacility(tansferCompeleteDto);
  }

  @Get('facility')
  async facilityTransactionHistory(@Query('facilityId') facilityId: string) {
    return this.transactionsService.facilityTransctionHistory(facilityId);
  }

  @Get('mother')
  async motherTransactionHistory(@Param('userId') userId: string) {
    return this.transactionsService.motherTransctionHistory(userId);
  }

  @Patch('resetFacility')
  async resetFacilityWalletBalance(@Param('facilityId') facilityId: string) {
    return this.transactionsService.resetFacilityWalletBalance(facilityId);
  }
}
