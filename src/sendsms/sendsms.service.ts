import { BadRequestException, Injectable } from '@nestjs/common';
import * as AfricasTalking from 'africastalking';

import { PrismaService } from '../prisma/prisma.service';
import { Message } from './events/message.event';
import { DatePicker } from '../helpers/date-picker';

export interface SMSProps {
  phoneNumber: string;
  message: string;
}

@Injectable()
export class SendsmsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly datePicker: DatePicker,
  ) {}

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
      from: '22210',
    };

    try {
      const sent = await this.sms.send(options);

      const cost = sent.SMSMessageData.Recipients[0].cost.split('KES ')[1];

      const val: Message = {
        status: sent.SMSMessageData.Recipients[0].status,
        statusCode: sent.SMSMessageData.Recipients[0].statusCode,
        messageId: sent.SMSMessageData.Recipients[0].messageId,
        cost: +cost,
      };

      await this.prisma.message
        .create({
          data: {
            ...val,
          },
        })
        .then((data) => data)
        .catch((err) => {
          console.log('err', err);
        });
    } catch (error) {
      console.log(error);
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

  async sendSMSMultipleNumbersFn(data: SMSProps[]) {
    const phoneNumbers = data.map((item) => item.phoneNumber).join(',');
    const message = data[0]?.message; 
  
    const options = {
      to: phoneNumbers,
      message,
      from: '22210',
    };
  
    try {
      const sent = await this.sms.send(options);
  
      const recipients = sent.SMSMessageData.Recipients.map((recipient) => ({
        status: recipient.status,
        statusCode: recipient.statusCode,
        messageId: recipient.messageId,
        cost: +recipient.cost.split('KES ')[1],
      }));
  
      // Save each recipient's data to the database
      await Promise.all(
        recipients.map((val) =>
          this.prisma.message.create({
            data: {
              ...val,
            },
          }),
        ),
      );
  
      return recipients; // Return the recipients' statuses
    } catch (error) {
      console.log(error);
      const statusCode = error?.response?.status;
      const status = error?.response?.statusText;
  
      await this.prisma.message.create({
        data: {
          status,
          statusCode,
        },
      });
  
      throw new BadRequestException('Failed to send SMS');
    }
  }

  async findSMS() {
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
        by: ['status'],
        _count: {
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
            lte: this.datePicker.monthRange().endOfMonth,
            gte: this.datePicker.monthRange().startOfMonth,
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

  async monthlySMS() {
    const totalCost = await this.prisma.message
      .count({
        where: {
          createdAt: {
            lte: this.datePicker.monthRange().endOfMonth,
            gte: this.datePicker.monthRange().startOfMonth,
          },

          status: 'Success',
        },
      })
      .then((data) => ({
        count: data,
      }))
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return totalCost;
  }

  async allSMSCount() {
    const totalCost = await this.prisma.message
      .count({
        where: {
          status: 'Success',
        },
      })
      .then((data) => ({
        count: data,
      }))
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return totalCost;
  }

  async monthlyStats() {
    const stats = await this.prisma.message
      .groupBy({
        by: ['status'],
        where: {
          createdAt: {
            lte: this.datePicker.monthRange().endOfMonth,
            gte: this.datePicker.monthRange().startOfMonth,
          },
        },
        _count: {
          status: true,
        },
      })
      .then((data) => data);

    return stats;
  }
}
