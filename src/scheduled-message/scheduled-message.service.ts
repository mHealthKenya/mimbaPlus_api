import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduledMessageDto } from './dto/create-scheduled-message.dto';
import { UpdateScheduledMessageDto } from './dto/update-scheduled-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SMSProps } from 'src/sendsms/sendsms.service';
import { Cron } from '@nestjs/schedule';
import * as AfricasTalking from 'africastalking';

@Injectable()
export class ScheduledMessageService {
  constructor(private prisma: PrismaService) {}

  credentials = {
      apiKey: process.env.AT_API_KEY,
      username: process.env.AT_USERNAME,
    };
  
    AT = new AfricasTalking(this.credentials);
  
    sms = this.AT.SMS;

  async create(createScheduledMessageDto: CreateScheduledMessageDto) {
    if (!Array.isArray(createScheduledMessageDto.phoneNumbers) || createScheduledMessageDto.phoneNumbers.length === 0) {
      throw new BadRequestException('Phone numbers must be a non-empty array');
    }
    if (!createScheduledMessageDto.message || typeof createScheduledMessageDto.message !== 'string') {
      throw new BadRequestException('Message must be a non-empty string');
    }
    if (!createScheduledMessageDto.scheduledAt || isNaN(new Date(createScheduledMessageDto.scheduledAt).getTime())) {
      throw new BadRequestException('Scheduled time must be a valid date string');
    }
    const scheduledMessages = createScheduledMessageDto.phoneNumbers.map((phoneNumber) => ({
      userId: createScheduledMessageDto.userId, // Ensure this is a string, not an array
      message: createScheduledMessageDto.message,
      scheduledAt: new Date(createScheduledMessageDto.scheduledAt),
      sent: false,
      retries: 0,
      phoneNumber: phoneNumber, // Add phoneNumber if your model expects it
    }));
    const createdMessages = await this.prisma.scheduledMessage.createMany({
      data: scheduledMessages,
    });
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

  async updateScheduledMessage(id: string, updateScheduledMessageDto: UpdateScheduledMessageDto) {
    const scheduledMessage = await this.prisma.scheduledMessage.findUnique({
      where: { id },
    })
    if(!scheduledMessage){
      throw new NotFoundException('Scheduled message not found');
    }
    const updatedScheduledMessage = await this.prisma.scheduledMessage.update({
      where: { id },
      data: updateScheduledMessageDto,
    });
    return updatedScheduledMessage;
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
      const sentResults = await this.sendSMSMultipleNumbersFn(smsData);

      // Mark messages as sent
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

      // Increment retry count
      await Promise.all(
        pendingMessages.map((msg) =>
          this.prisma.scheduledMessage.update({
            where: { id: msg.id },
            data: {
              retries: { increment: 1 },
              updatedAt: new Date(),
            },
          }),
        ),
      );
    }
  }
}
