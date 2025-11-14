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

  // Initialize Africa's Talking with proper authentication
  AT = new AfricasTalking({
    apiKey: this.credentials.apiKey,
    username: this.credentials.username,
    format: 'json',
  });

  sms = this.AT.SMS;

  async sendSMSMultipleNumbersFn(data: SMSProps[]) {
    const phoneNumbers = data.map((item) => item.phoneNumber);
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

  async yearlymonthlySMS() {
    const currentYear = new Date().getFullYear();
    const startYear = 2023; // Starting year
    const years = Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => startYear + i,
    );
    const months = Array.from({ length: 12 }, (_, i) => i); // 0-11 for Jan-Dec

    const results = [];

    for (const year of years) {
      const yearlyData = {
        year,
        months: await Promise.all(
          months.map(async (month) => {
            // For the current year, don't count future months
            if (year === currentYear && month > new Date().getMonth()) {
              return {
                month: new Date(year, month, 1).toLocaleString('default', {
                  month: 'long',
                }),
                count: 0,
              };
            }

            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

            const count = await this.prisma.message.count({
              where: {
                status: 'Success',
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            });

            return {
              month: startDate.toLocaleString('default', { month: 'long' }),
              count,
            };
          }),
        ),
      };
      results.push(yearlyData);
    }

    return results;
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
