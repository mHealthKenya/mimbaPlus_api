import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduledMessageDto } from './dto/create-scheduled_message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendsmsService, SMSProps } from 'src/sendsms/sendsms.service';
import { Cron } from '@nestjs/schedule';
import { Roles } from 'src/users/users.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScheduledMessagesService {
  constructor(private prisma: PrismaService, private sendSms: SendsmsService) {}

  async create(dto: CreateScheduledMessageDto) {
    const { message, category, scheduledAt, gestationTarget, riskCondition } = dto;

    const shouldSetScheduleDate = category === 'GENERAL' || category === 'DELIVERED_MOTHERS';

    const newMessage = await this.prisma.scheduledMessage.create({
      data: {
        message,
        category,
        scheduledAt: shouldSetScheduleDate && scheduledAt ? new Date(scheduledAt) : null,
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
      return {
        message: 'No scheduled messages found',
        data: [],
      }
    }
    return allScheduledMessages;
  }

  async findScheduledMessageById(id: string) {
    const scheduledMessage = await this.prisma.scheduledMessage.findUnique({
      where: { id },
    });
    if(!scheduledMessage){
      return {
        message: 'Scheduled message not found',
        data: null,
      }
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
      return {
        message: 'No sent messages found',
        data: [],
      }
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
      return {
        message: 'No unsent messages found',
        data: [],
      }
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
      } else if (msg.category === 'DELIVERED_MOTHERS') {
        if (msg.scheduledAt && msg.scheduledAt <= now) {
          usersToNotify = await this.getDeliveredMothers();
        }
      } else if (msg.category === 'GESTATION_PERIOD') {
        usersToNotify = await this.getUsersByGestationTarget(msg.gestationTarget);
      } else if (msg.category === 'HIGH_RISK') {
        usersToNotify = await this.getUsersByRiskCondition(msg.riskCondition);
      }

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

private async getDeliveredMothers() {
  return this.prisma.user.findMany({
    where: {
      active: true,
      role: Roles.MOTHER,
      hasDelivered: true,
    },
    select: {
      phone_number: true,
      id: true,
    },
  });
}

private async getUsersByRiskCondition(condition?: string) {
  const normalizedCondition = this.normalizeRiskCondition(condition);

  if (!normalizedCondition) {
    return [];
  }

  const baseWhere: Prisma.BioDataWhereInput = {
    user: {
      active: true,
      role: Roles.MOTHER,
    },
  };

  let where: Prisma.BioDataWhereInput | null = null;

  switch (normalizedCondition) {
    case 'AGE_35_PLUS':
      where = {
        ...baseWhere,
        age: {
          gte: 35,
        },
      };
      break;
    case 'MULTIPLE_PREGNANCY':
    case 'MULTIPLE_PREGNANCIES':
      where = {
        ...baseWhere,
        gravidity: {
          gt: 1,
        },
      };
      break;
    case 'TEENAGE_PREGNANCIES':
    case 'TEENAGE_PREGNANCY':
      where = {
        ...baseWhere,
        age: {
          gt: 0,
          lt: 20,
        },
      };
      break;
    case 'HIV_REACTIVE':
    case 'HIV_POSITIVE':
      where = {
        ...baseWhere,
        ClinicVisit: {
          some: {
            OR: [
              {
                hiv: {
                  contains: 'reactive',
                  mode: 'insensitive',
                },
              },
              {
                hiv: {
                  contains: 'positive',
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
      };
      break;
    case 'CARDIAC':
      where = {
        ...baseWhere,
        ClinicVisit: {
          some: {
            OR: [
              {
                treatment: {
                  contains: 'cardiac',
                  mode: 'insensitive',
                },
              },
              {
                notes: {
                  contains: 'cardiac',
                  mode: 'insensitive',
                },
              },
              {
                notes: {
                  contains: 'heart',
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
      };
      break;
    case 'DIABETES':
      where = {
        ...baseWhere,
        ClinicVisit: {
          some: {
            OR: [
              {
                treatment: {
                  contains: 'diab',
                  mode: 'insensitive',
                },
              },
              {
                notes: {
                  contains: 'diab',
                  mode: 'insensitive',
                },
              },
              {
                bloodRBS: {
                  contains: 'high',
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
      };
      break;
    case 'HYPERTENSION':
      where = {
        ...baseWhere,
        ClinicVisit: {
          some: {
            OR: [
              {
                treatment: {
                  contains: 'hyper',
                  mode: 'insensitive',
                },
              },
              {
                notes: {
                  contains: 'hyper',
                  mode: 'insensitive',
                },
              },
              {
                notes: {
                  contains: 'preeclamp',
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
      };
      break;
    default:
      return [];
  }

  const bioDataWithUsers = await this.prisma.bioData.findMany({
    where,
    include: {
      user: {
        select: {
          phone_number: true,
          id: true,
        },
      },
    },
  });

  return bioDataWithUsers
    .filter((bio) => bio.user !== null)
    .map((bio) => ({
      phone_number: bio.user.phone_number,
      id: bio.user.id,
    }));
}

private normalizeRiskCondition(condition?: string) {
  if (!condition) {
    return '';
  }

  return condition
    .replace(/\+/g, ' PLUS ')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}


}

