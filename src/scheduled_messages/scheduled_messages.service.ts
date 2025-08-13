import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduledMessageDto } from './dto/create-scheduled_message.dto';
import { UpdateScheduledMessageDto } from './dto/update-scheduled_message.dto';
import { SendsmsService, SMSProps } from 'src/sendsms/sendsms.service';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduledMessagesService {
  constructor(private prisma: PrismaService, private sendSms: SendsmsService) {}

  async create(createScheduledMessageDto: CreateScheduledMessageDto) {
  const { userId, message, scheduledAt } = createScheduledMessageDto;
  

  // Create a message for each user in the array
  const createdMessages = await this.prisma.$transaction(
    userId.map(userId => 
      this.prisma.scheduledMessage.create({
        data: {
          userId,
          message,
          scheduledAt: new Date(scheduledAt),
        },
      })
    )
  );
  return createdMessages;
}


  async findAllScheduledMessage() {
    const allScheduledMessages = await this.prisma.scheduledMessage.findMany({
      include: {
        user: true,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });
    if (!allScheduledMessages || allScheduledMessages.length === 0) {
      throw new NotFoundException('No scheduled messages found');
    }
    return allScheduledMessages;
  }

  async findScheduledMessageById(id: string) {
    const scheduledMessage = await this.prisma.scheduledMessage.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if(!scheduledMessage){
      throw new NotFoundException('Scheduled message not found');
    }
    return scheduledMessage;
  }

  async findAllSentMessages() {
    const sentMessages = await this.prisma.scheduledMessage.findMany({
      where: { sent: true },
      include: {
        user: true,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });
    if (!sentMessages || sentMessages.length === 0) {
      throw new NotFoundException('No sent messages found');
    }
    return sentMessages;
  }

  async findAllUnSentMessages() {
    const unsentMessages = await this.prisma.scheduledMessage.findMany({
      where: { sent: false },
      include: {
        user: true,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });
    if (!unsentMessages || unsentMessages.length === 0) {
      throw new NotFoundException('No unsent messages found');
    }
    return unsentMessages;
  }



  async removeScheduledMessage(id: string) {
    const scheduledMessage = await this.prisma.scheduledMessage.findUnique({
      where: { id },
    });
    if(!scheduledMessage){
      throw new NotFoundException('Scheduled message not found');
    }
    return await this.prisma.scheduledMessage.delete({
      where: { id },
    });
  }

  // 2. Cron job to send messages every day at 9 AM
  @Cron('0 9 * * *')
  async sendPendingScheduledMessages() {
    const now = new Date();

    const pendingMessages = await this.prisma.scheduledMessage.findMany({
      where: {
        scheduledAt: {
          lte: now,
        },
        sent: false,
      },
      include: {
        user: true,
      },
    });

    if (pendingMessages.length === 0) {
      console.log('No scheduled messages to send.');
      return;
    }

    // Prepare bulk SMS data
    const smsData: SMSProps[] = pendingMessages.map((msg) => ({
      phoneNumber: msg.user.phone_number,
      message: msg.message,
    }));

    try {
      const sentResults = await this.sendSms.sendSMSMultipleNumbersFn(smsData);
      await Promise.all(
        pendingMessages.map((msg) =>
          this.prisma.scheduledMessage.update({
            where: { id: msg.id },
            data: { sent: true, updatedAt: new Date() },
          }),
        ),
      );

      console.log(`Successfully sent ${sentResults.length} messages.`);
    } catch (err) {
      console.error('Failed to send Scheduled SMS, retrying tomorrow...', err);
      await Promise.all(
        pendingMessages.map((msg) =>
          this.prisma.scheduledMessage.update({
            where: { id: msg.id },
            data: {
              retries: { increment: 1 },
              sent: false,
              updatedAt: new Date(),
            },
          }),
        ),
      );
    }
  }
}
