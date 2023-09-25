import { Module } from '@nestjs/common';
import { UserHelper } from 'src/helpers/user-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendsmsController } from './sendsms.controller';
import { SendsmsService } from './sendsms.service';

@Module({
  controllers: [SendsmsController],
  providers: [PrismaService, UserHelper, SendsmsService],
})
export class SendsmsModule {}
