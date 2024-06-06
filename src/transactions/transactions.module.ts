import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { OtpService } from '../otp/otp.service';
import { SendsmsModule } from '../sendsms/sendsms.module';
import { SendsmsService } from '../sendsms/sendsms.service';
import { DatePicker } from 'src/helpers/date-picker';

@Module({
  imports: [SendsmsModule, ],
  controllers: [TransactionsController],
  providers: [TransactionsService,  PrismaService, CreateTransactionDto, SendsmsService, DatePicker],
  
})
export class TransactionsModule {}
