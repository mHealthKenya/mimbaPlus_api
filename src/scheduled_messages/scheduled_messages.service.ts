import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduledMessageDto } from './dto/create-scheduled_message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendsmsService, SMSProps } from 'src/sendsms/sendsms.service';
import { Cron } from '@nestjs/schedule';
import { Roles } from 'src/users/users.service';

@Injectable()
export class ScheduledMessagesService {
  constructor(private prisma: PrismaService, private sendSms: SendsmsService) {}

  async create(dto: CreateScheduledMessageDto) {
    const { message, category, scheduledAt, gestationTarget, riskCondition } = dto;

    const newMessage = await this.prisma.scheduledMessage.create({
      data: {
        message,
        category,
        scheduledAt: category === 'GENERAL' ? new Date(scheduledAt) : null,
        gestationTarget: category === 'GESTATION_PERIOD' ? gestationTarget : null,
        riskCondition: category === 'HIGH_RISK' ? riskCondition : null,
      },
    });

    return newMessage;
  }

  async findAllScheduledMessage() {
    const allScheduledMessages = await this.prisma.scheduledMessage.findMany({
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
    });
    if(!scheduledMessage){
      throw new NotFoundException('Scheduled message not found');
    }
    return scheduledMessage;
  }

  async findAllSentMessages() {
    const sentMessages = await this.prisma.scheduledMessage.findMany({
      where: { sent: true },
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

  

  try {
    const pendingMessages = await this.prisma.scheduledMessage.findMany({
      where: { sent: false },
    });

    if (pendingMessages.length === 0) {
      console.log('No scheduled messages to send.');
      return;
    }

    for (const msg of pendingMessages) {
      let usersToNotify: { phone_number: string; id: string }[] = [];

      if (msg.category === 'GENERAL') {
        if (msg.scheduledAt && msg.scheduledAt <= now) {
          usersToNotify = await this.prisma.user.findMany({
            where: {
              active: true,
              role: Roles.MOTHER,
            },
            select: { phone_number: true, id: true },
          });
        }
      }

      if (msg.category === 'GESTATION_PERIOD') {
        usersToNotify = await this.getUsersByGestationTarget(msg.gestationTarget);
      }

      // if (msg.category === 'HIGH_RISK') {
      //   usersToNotify = await this.getUsersByRiskCondition(msg.riskCondition);
      // }

      // If there are users to notify, send SMS
      if (usersToNotify.length > 0) {
        const smsData: SMSProps[] = usersToNotify.map((user) => ({
          phoneNumber: user.phone_number,
          message: msg.message,
        }));

        try {
          await this.sendSms.sendSMSMultipleNumbersFn(smsData);

          // Mark this message as sent
          await this.prisma.scheduledMessage.update({
            where: { id: msg.id },
            data: { sent: true },
          });

          console.log(`✅ Sent message "${msg.message}" to ${usersToNotify.length} mothers`);
        } catch (smsError) {
          console.error(`❌ Failed to send message "${msg.message}"`, smsError);
        }
      } else {
        console.log(`No matching mothers for message "${msg.message}"`);
      }
    }
  } catch (error) {
    console.error('❌ Error running cron job:', error);
  }
}

private async getUsersByGestationTarget(targetWeeks: number) {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - (targetWeeks * 7));
  
  const bioDataWithUsers = await this.prisma.bioData.findMany({
    where: {
      last_monthly_period: {
        lte: targetDate
      },
      user: {
        active: true,
        role: Roles.MOTHER
      }
    },
    include: {
      user: {
        select: {
          phone_number: true,
          id: true
        }
      }
    }
  });

  return bioDataWithUsers
    .filter(bio => bio.user !== null)
    .map(bio => ({
      phone_number: bio.user.phone_number,
      id: bio.user.id
    }));
}

// private async getUsersByRiskCondition(condition: string) {
//   let ageFilter: any = {};
//   let gravidityFilter: any = {};

//   if (condition === 'AGE_35_PLUS') {
//     ageFilter = { gte: 35 };
//   } else if (condition === 'MULTIPLE_PREGNANCY') {
//     gravidityFilter = { gt: 1 };
//   }

//   const bioDataWithUsers = await this.prisma.bioData.findMany({
//     where: {
//       age: ageFilter,
//       gravidity: gravidityFilter,
//       user: {
//         active: true,
//         role: Roles.MOTHER
//       }
//     },
//     include: {
//       user: {
//         select: {
//           phone_number: true,
//           id: true
//         }
//       }
//     }
//   });

//   return bioDataWithUsers
//     .filter(bio => bio.user !== null)
//     .map(bio => ({
//       phone_number: bio.user.phone_number,
//       id: bio.user.id
//     }));
// }


}

