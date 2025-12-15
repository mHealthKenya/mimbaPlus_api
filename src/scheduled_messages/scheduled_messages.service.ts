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
    const { message, category, scheduledAt, gestationTarget, riskCondition, monthsSinceDelivery } = dto;

    const shouldSetScheduleDate = category === 'GENERAL' || category === 'DELIVERED_MOTHERS' || category === 'HIGH_RISK';

    let scheduledDate: Date | null = null;
    if (shouldSetScheduleDate && scheduledAt) {
      const date = new Date(scheduledAt);
      // Set time to start of day (00:00:00) for date-only input
      date.setHours(0, 0, 0, 0);
      scheduledDate = date;
    }

    const newMessage = await this.prisma.scheduledMessage.create({
      data: {
        message,
        category,
        scheduledAt: scheduledDate,
        gestationTarget: category === 'GESTATION_PERIOD' ? gestationTarget : null,
        riskCondition: category === 'HIGH_RISK' ? riskCondition : null,
        monthsSinceDelivery: category === 'DELIVERED_MOTHERS' ? monthsSinceDelivery : null,
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
  // Set to start of day for date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

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

      // Helper function to check if scheduled date has arrived (date-only comparison)
      const isScheduledDateReached = (scheduledAt: Date | null): boolean => {
        if (!scheduledAt) return false;
        const scheduledDate = new Date(scheduledAt.getFullYear(), scheduledAt.getMonth(), scheduledAt.getDate());
        return scheduledDate <= today;
      };

      if (msg.category === 'GENERAL') {
        if (isScheduledDateReached(msg.scheduledAt)) {
          usersToNotify = await this.prisma.user.findMany({
            where: {
              active: true,
              role: Roles.MOTHER,
            },
            select: { phone_number: true, id: true },
          });
        }
      } else if (msg.category === 'DELIVERED_MOTHERS') {
        if (isScheduledDateReached(msg.scheduledAt)) {
          usersToNotify = await this.getDeliveredMothers(msg.monthsSinceDelivery);
        }
      } else if (msg.category === 'GESTATION_PERIOD') {
        usersToNotify = await this.getUsersByGestationTarget(msg.gestationTarget);
      } else if (msg.category === 'HIGH_RISK') {
        if (isScheduledDateReached(msg.scheduledAt)) {
          usersToNotify = await this.getUsersByRiskCondition(msg.riskCondition);
        }
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

private async getDeliveredMothers(monthsSinceDelivery?: number | null) {
  // If no months filter, return all delivered mothers
  if (monthsSinceDelivery === null || monthsSinceDelivery === undefined) {
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

  // Get all admissions for delivered mothers with their discharges
  const admissions = await this.prisma.admission.findMany({
    where: {
      user: {
        active: true,
        role: Roles.MOTHER,
        hasDelivered: true,
      },
    },
    include: {
      user: {
        select: {
          phone_number: true,
          id: true,
        },
      },
      DischargeRequest: {
        include: {
          Discharge: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      },
    },
  });

  const now = new Date();
  const targetMonths = monthsSinceDelivery;
  
  // Filter mothers whose most recent discharge is approximately at the target months
  // We'll use a range of ±0.5 months for matching
  const filteredMothers = admissions
    .filter((admission) => {
      // Find the most recent discharge across all discharge requests
      let mostRecentDischarge: any = null;
      let mostRecentDate: Date | null = null;

      for (const request of admission.DischargeRequest) {
        for (const discharge of request.Discharge) {
          const dischargeDate = new Date(discharge.createdAt);
          if (!mostRecentDate || dischargeDate > mostRecentDate) {
            mostRecentDate = dischargeDate;
            mostRecentDischarge = discharge;
          }
        }
      }

      if (!mostRecentDischarge || !mostRecentDate) {
        return false;
      }

      // Calculate months since discharge
      const monthsDiff = (now.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      // Check if it's within ±0.5 months of the target
      return Math.abs(monthsDiff - targetMonths) <= 0.5;
    })
    .map((admission) => ({
      phone_number: admission.user.phone_number,
      id: admission.user.id,
    }));

  // Remove duplicates (in case a mother has multiple admissions)
  const uniqueMothers = Array.from(
    new Map(filteredMothers.map((mother) => [mother.id, mother])).values()
  );

  return uniqueMothers;
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
    case 'TWIN_TRIPLET_PREGNANCIES':
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

