import { BadRequestException, Injectable } from '@nestjs/common';
import * as AfricasTalking from 'africastalking';
import { SMSProps } from '../helpers/sendsms';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from './events/message.event';

@Injectable()
export class SendsmsService {
  constructor(private readonly prisma: PrismaService) {}

  today = new Date();
  startOfMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  endOfMonth = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);

  credentials = {
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME,
  };

  AT = new AfricasTalking(this.credentials);

  sms = this.AT.SMS;

  async sendSMSFn(data: SMSProps) {
    const { phoneNumber, message } = data;

    const options = {
      to: [phoneNumber],
      message,
      from: '33861',
    };

    try {
      const sent = await this.sms.send(options);

      const cost = sent.SMSMessageData.Recipients[0].cost.split('KES ')[1];
      const messagePart =
        +sent.SMSMessageData.Message.split('Message parts: ')[1];

      const val: Message = {
        status: sent.SMSMessageData.Recipients[0].status,
        statusCode: sent.SMSMessageData.Recipients[0].statusCode,
        messageId: sent.SMSMessageData.Recipients[0].messageId,
        cost: +cost,
        messagePart,
      };

      await this.prisma.message.create({
        data: {
          ...val,
        },
      });
    } catch (error) {
      const statusCode = error?.response?.status;
      const status = error?.response?.statusText;

      await this.prisma.message.create({
        data: {
          status,
          statusCode,
        },
      });
    }
  }

  async findSMS() {
    console.log({
      today: this.today,
      start: this.startOfMonth,
      end: this.endOfMonth,
    });
    const val = await this.prisma.message
      .findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return val;
  }

  async smsCost() {
    const totalCost = await this.prisma.message
      .aggregate({
        _sum: {
          cost: true,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return totalCost;
  }

  async smsStats() {
    const stats = await this.prisma.message
      .groupBy({
        by: ['statusCode'],
        _count: {
          statusCode: true,
          status: true,
        },
      })
      .then((data) => data);

    return stats;
  }

  async monthlySMSCost() {
    const totalCost = await this.prisma.message
      .aggregate({
        where: {
          createdAt: {
            lte: this.endOfMonth,
            gte: this.startOfMonth,
          },
        },
        _sum: {
          cost: true,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return totalCost;
  }

  async monthlyStats() {
    const stats = await this.prisma.message
      .groupBy({
        by: ['statusCode'],
        where: {
          createdAt: {
            lte: this.endOfMonth,
            gte: this.startOfMonth,
          },
        },
        _count: {
          statusCode: true,
          status: true,
        },
      })
      .then((data) => data);

    return stats;
  }
}
