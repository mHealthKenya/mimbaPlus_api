import { Module } from '@nestjs/common';
import { ScheduledMessageService } from './scheduled-message.service';
import { ScheduledMessageController } from './scheduled-message.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendsmsService } from 'src/sendsms/sendsms.service';

@Module({
  controllers: [ScheduledMessageController],
  providers: [ScheduledMessageService, PrismaService, SendsmsService],
})
export class ScheduledMessageModule {}
