import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService,  PrismaService, CreateTransactionDto],
})
export class TransactionsModule {}
