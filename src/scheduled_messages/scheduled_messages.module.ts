import { Module } from '@nestjs/common';
import { ScheduledMessagesService } from './scheduled_messages.service';
import { ScheduledMessagesController } from './scheduled_messages.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendsmsService } from 'src/sendsms/sendsms.service';
import { DatePicker } from 'src/helpers/date-picker';
import { UserHelper } from 'src/helpers/user-helper';

@Module({
  controllers: [ScheduledMessagesController],
  providers: [ScheduledMessagesService, PrismaService, SendsmsService, DatePicker, UserHelper]
})
export class ScheduledMessagesModule {}
