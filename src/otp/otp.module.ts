import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SendsmsService } from 'src/sendsms/sendsms.service';

@Module({
  controllers: [OtpController],
  providers: [OtpService, PrismaService, SendsmsService]
})
export class OtpModule {}
