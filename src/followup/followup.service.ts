import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFollowupDto } from './dto/create-followup.dto';
import { ScheduleStatus } from '../schedules/schedules.service';
import { Roles } from '../users/users.service';
import { UserHelper } from '../helpers/user-helper';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import sendMessage from '../helpers/sendsms';
import { CreateFollowUpEvent } from './events/followup-created.event';

export enum FollowUpStatus {
  Sent = 'Sent',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
}

@Injectable()
export class FollowupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userHelper: UserHelper,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(createFollowupDto: CreateFollowupDto) {
    const scheduleD = this.prisma.schedule.findUnique({
      where: {
        id: createFollowupDto.scheduleId,
      },

      include: {
        mother: {
          select: {
            f_name: true,
            l_name: true,
            phone_number: true,
          },
        },
      },
    });

    const userD = this.prisma.user.findUnique({
      where: {
        id: createFollowupDto.chvId,
      },

      include: {
        Facility: {
          select: {
            name: true,
          },
        },
      },
    });

    const [schedule, user] = await Promise.all([scheduleD, userD]);

    if (!user) {
      throw new BadRequestException('Invalid CHV Id');
    }

    if (user?.role !== Roles.CHV) {
      throw new BadRequestException('Invalid CHV Id');
    }

    const newFollowUp = this.prisma.followUp.create({
      data: createFollowupDto,
    });

    const updateVisitStatus = this.prisma.schedule.update({
      where: {
        id: createFollowupDto.scheduleId,
      },
      data: { status: ScheduleStatus.FOLLOW_UP },
    });

    const data = await this.prisma
      .$transaction([newFollowUp, updateVisitStatus])
      .then(() => {
        this.eventEmitter.emit(
          'm+:followup.created',
          new CreateFollowUpEvent({
            motherName: schedule.mother.f_name + ' ' + schedule.mother.l_name,
            motherPhone: schedule.mother.phone_number,
            chvName: user.f_name + ' ' + user.l_name,
            chvPhone: user.phone_number,
            facilityName: user.Facility.name,
          }),
        );
        return {
          status: 'success',
          message: 'Follow up request successfully sent',
        };
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return data;
  }

  async getFollowUps() {
    const chvId = this.userHelper.getUser().id;
    const followUps = await this.prisma.followUp
      .findMany({
        where: {
          chvId,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return followUps;
  }

  async completeFollowUp(id: string) {
    const updated = await this.prisma.followUp
      .update({
        where: {
          id,
        },

        data: {
          status: FollowUpStatus.Completed,
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return updated;
  }

  @OnEvent('m+:followup.created')
  async handleScheduleCreated(props: CreateFollowUpEvent) {
    const { data } = props;

    const {
      chvPhone: phone_number,
      chvName,
      motherName,
      motherPhone,
      facilityName,
    } = data;

    const message =
      'Hi ' +
      chvName +
      '. You have been requested to conduct a followup for ' +
      motherName +
      ' her phone number is ' +
      motherPhone +
      ' Please ensure she visits ' +
      facilityName +
      ' at the earliest time possible';

    await sendMessage({
      phoneNumber: '+' + phone_number,
      message: message,
    });
  }
}
