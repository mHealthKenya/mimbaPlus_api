import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from '../otp/otp.service';
import { SendsmsService } from 'src/sendsms/sendsms.service';
import { DatePicker } from '../helpers/date-picker';

@Module({
  controllers: [WalletController],
  providers: [WalletService, PrismaService, OtpService, SendsmsService, DatePicker]
})
export class WalletModule {}
