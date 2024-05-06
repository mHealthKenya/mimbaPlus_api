import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from '../otp/otp.service';

@Module({
  controllers: [WalletController],
  providers: [WalletService, PrismaService, OtpService]
})
export class WalletModule {}
