import { BadRequestException, Injectable } from '@nestjs/common';
import * as AfricasTalking from 'africastalking';
import { SendSMSDto } from './dto/send-sms.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from 'src/sendsms/events/message.event';

@Injectable()
export class CommunicationService {
  constructor(private readonly prisma: PrismaService) {}

  credentials = {
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME,
  };

  AT = new AfricasTalking(this.credentials);

  sms = this.AT.SMS;

  async sendSMS({ phoneNumbers, message }: SendSMSDto) {
    const validPhoneNumbers = phoneNumbers.filter((phoneNumber) =>
      /^\+254\d{9}$/.test(phoneNumber),
    );

    const options = {
      to: validPhoneNumbers,
      message,
      from: '22210',
    };
    console.log('error', phoneNumbers);

    try {
      const sent = await this.sms.send(options);

      const costs = sent.SMSMessageData.Recipients.map((recipient) => {
        return recipient.cost.split('KES ')[1];
      });

      console.log('costs', costs);

      const vals: Message[] = sent.SMSMessageData.Recipients.map(
        (recipient, index) => {
          return {
            status: recipient.status,
            statusCode: recipient.statusCode,
            messageId: recipient.messageId,
            cost: +costs[index],
          };
        },
      );

      const success = await this.prisma.message
        .createMany({
          data: vals,
        })
        .then((data) => data)
        .catch((err) => {
          console.log('err', err);
        });

      if (success) {
        return {
          message: 'SMS sent successfully',
        };
      }
    } catch (error) {
      console.log(error);
      const statusCode = error?.response?.status || 500;
      const status = error?.response?.statusText || 'Failed';

      await this.prisma.message.create({
        data: {
          status,
          statusCode,
        },
      });

      throw new BadRequestException('Failed to send SMS');
    }
  }
}
