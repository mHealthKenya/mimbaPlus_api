import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SendsmsService } from '../sendsms/sendsms.service';
import { DatePicker } from '../helpers/date-picker';

@Module({
  controllers: [OtpController],
  providers: [OtpService, PrismaService, SendsmsService, DatePicker]
})
export class OtpModule {}
