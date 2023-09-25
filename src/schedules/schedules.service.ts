import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { FollowUpStatus, FollowupService } from '../followup/followup.service';
import sendMessage from '../helpers/sendsms';
import { UserHelper } from '../helpers/user-helper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleCreatedEvent } from './events/create-schedule.event';
import { ScheduleUpdatedEvent } from './events/update-schedule.event';

export enum ScheduleStatus {
  SCHEDULED = 'Scheduled',
  CANCELED = 'Canceled',
  COMPLETED = 'Completed',
  FOLLOW_UP = 'Follow_up',
}

@Injectable()
export class SchedulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userHelper: UserHelper,
    private readonly eventEmitter: EventEmitter2,
    private readonly followUpService: FollowupService,
  ) {}
  async create(createScheduleDto: CreateScheduleDto) {
    const createdById = this.userHelper.getUser().id;
    const updatedById = this.userHelper.getUser().id;

    const newSchedule = await this.prisma.schedule
      .create({
        data: {
          ...createScheduleDto,
          createdById,
          updatedById,
          date: new Date(createScheduleDto.date),
        },
      })
      .then((data) => {
        this.eventEmitter.emit(
          'm+:schedule.created',
          new ScheduleCreatedEvent({
            motherId: data.motherId,
            facilityId: data.facilityId,
            title: data.title,
            description: data.description,
            date: data.date,
          }),
        );

        return data;
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return newSchedule;
  }

  async findByMotherId(motherId: string) {
    const schedulesByMotherId = await this.prisma.schedule
      .findMany({
        where: {
          motherId,
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

        orderBy: {
          updatedAt: 'desc',
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return schedulesByMotherId;
  }

  async findAll() {
    const allSchedules = await this.prisma.schedule
      .findMany({
        orderBy: {
          updatedAt: 'desc',
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return allSchedules;
  }

  async findByFacility(facilityId: string) {
    const schedulesByFacility = await this.prisma.schedule
      .findMany({
        where: {
          facilityId,
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

        orderBy: {
          updatedAt: 'desc',
        },
      })
      .then((data) => data)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return schedulesByFacility;
  }

  async updateSchedule(data: UpdateScheduleDto) {
    const { id, chvId, ...rest } = data;
    const status = rest?.status;

    if (
      status &&
      !Object.values(ScheduleStatus).includes(status as ScheduleStatus)
    ) {
      throw new BadRequestException(
        'status must be either ' +
          ScheduleStatus.SCHEDULED +
          ', ' +
          ScheduleStatus.FOLLOW_UP +
          ', ' +
          ScheduleStatus.COMPLETED +
          ', or ' +
          ScheduleStatus.CANCELED,
      );
    }

    const updatedSchedule = await this.prisma.schedule
      .update({
        where: {
          id,
        },
        data: {
          ...rest,
          motherId: undefined,
          updatedById: this.userHelper.getUser().id,
        },
      })
      .then((data) => {
        if (chvId && rest?.status === ScheduleStatus.FOLLOW_UP) {
          this.eventEmitter.emit(
            'm+:schedule.updated-followup',
            new ScheduleUpdatedEvent({
              id: data.id,
              motherId: data.motherId,
              facilityId: data.facilityId,
              title: data.title,
              description: data.description,
              date: data.date,
              chvId,
            }),
          );
        }

        this.eventEmitter.emit(
          'm+:schedule.updated',
          new ScheduleUpdatedEvent({
            id: data.id,
            motherId: data.motherId,
            facilityId: data.facilityId,
            title: data.title,
            description: data.description,
            date: data.date,
            chvId,
          }),
        );

        return data;
      })
      .catch((err) => {
        throw new BadRequestException(err);
      });

    return updatedSchedule;
  }

  @OnEvent('m+:schedule.created')
  async handleScheduleCreated(props: ScheduleCreatedEvent) {
    const { data } = props;

    const motherD = this.prisma.user.findUnique({
      where: {
        id: data.motherId,
      },
    });

    const facilityD = this.prisma.facility.findUnique({
      where: {
        id: data.facilityId,
      },
    });

    const [mother, facility] = await Promise.all([motherD, facilityD]);

    const { phone_number, f_name, l_name } = mother;

    const { name } = facility;

    const { date, title } = data;

    const time = new Date(date).toLocaleString();

    const message =
      'Hi ' +
      f_name +
      ' ' +
      l_name +
      '. You have been scheduled for a ' +
      title +
      ' at ' +
      name +
      '. Please avail your self on ' +
      time.split(', ')[0] +
      ' at ' +
      time.split(', ')[1];

    await sendMessage({
      phoneNumber: '+' + phone_number,
      message: message,
    });
  }

  @OnEvent('m+:schedule.updated')
  async handleScheduleUpdated(props: ScheduleUpdatedEvent) {
    const { data } = props;

    const { date, title, id } = data;

    const motherD = this.prisma.user.findUnique({
      where: {
        id: data.motherId,
      },
    });

    const facilityD = this.prisma.facility.findUnique({
      where: {
        id: data.facilityId,
      },
    });

    const scheduleD = this.prisma.schedule.findUnique({
      where: {
        id,
      },
    });

    const [mother, facility, schedule] = await Promise.all([
      motherD,
      facilityD,
      scheduleD,
    ]);

    const { phone_number, f_name, l_name } = mother;

    const { name } = facility;

    const time = new Date(date).toLocaleString();

    let message = '';

    switch (schedule.status) {
      case ScheduleStatus.CANCELED:
        await this.prisma.followUp.update({
          where: {
            scheduleId: schedule.id,
          },

          data: {
            status: FollowUpStatus.Cancelled,
          },
        });
        message =
          'Hi ' +
          f_name +
          ' ' +
          l_name +
          '. Your schedule for ' +
          title +
          ' at ' +
          name +
          ' on ' +
          time.split(', ')[0] +
          ' at ' +
          time.split(', ')[1] +
          ' Has been cancelled. Please reach out to your CHV or Facility for further information';

        await sendMessage({
          phoneNumber: '+' + phone_number,
          message: message,
        });
        break;

      case ScheduleStatus.FOLLOW_UP:
        break;

      default:
        message =
          'Hi ' +
          f_name +
          ' ' +
          l_name +
          '. There has been an update in your schedule. You have been scheduled for a ' +
          title +
          ' at ' +
          name +
          '. Please avail your self on ' +
          time.split(', ')[0] +
          ' at ' +
          time.split(', ')[1];

        await sendMessage({
          phoneNumber: '+' + phone_number,
          message: message,
        });
        break;
    }
  }

  @OnEvent('m+:schedule.updated-followup')
  async handleScheduleUpdatedCHV(props: ScheduleUpdatedEvent) {
    const { data } = props;

    const { id, chvId } = data;

    const scheduleD = this.prisma.schedule.findUnique({
      where: {
        id,
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
        id: chvId,
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

    const chvName = user?.f_name + ' ' + user?.l_name;

    const motherName =
      schedule?.mother?.f_name + ' ' + schedule?.mother?.l_name;

    const motherPhone = '+' + schedule?.mother?.phone_number;

    const facilityName = user?.Facility?.name;

    const phone_number = user?.phone_number;

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
