import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UserHelper } from '../helpers/user-helper';
import { FindByFacilityDto } from './dto/find-by-facility.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

const prismaService = {
  schedule: {
    create: jest.fn().mockImplementation(async () => ({
      id: 'sampleId',
      title: 'Test Schedule',
      description: ' A test schedule',
      facilityId: 'facilityId',
      date: new Date(),
      status: 'Scheduled',
      motherId: 'motherId',
      createdById: 'createdById',
      updatedById: 'createdById',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),

    findMany: jest.fn().mockImplementation(async () => [
      {
        id: 'sampleId',
        title: 'Test Schedule',
        description: ' A test schedule',
        facilityId: 'facilityId',
        date: new Date(),
        status: 'Scheduled',
        motherId: 'motherId',
        createdById: 'createdById',
        updatedById: 'createdById',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

    update: jest.fn().mockImplementation(async () => ({
      id: 'sampleId',
      title: 'Test Schedule Edit',
      description: ' A test schedule',
      facilityId: 'facilityId',
      date: new Date(),
      status: 'Scheduled',
      motherId: 'motherId',
      createdById: 'createdById',
      updatedById: 'createdById',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  },
};

const userHelper = {
  getUser() {
    return {
      id: 'createdById',
    };
  },
};

describe('SchedulesService', () => {
  let service: SchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulesService, PrismaService, UserHelper, EventEmitter2],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .overrideProvider(UserHelper)
      .useValue(userHelper)
      .compile();

    service = module.get<SchedulesService>(SchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new schedule', async () => {
    const schedule: CreateScheduleDto = {
      title: 'Test Schedule',
      description: ' A test schedule',
      facilityId: 'facilityId',
      date: '2023-07-21 10:00',
      motherId: 'motherId',
    };

    const newSchedule = await service.create(schedule);

    expect(prismaService.schedule.create).toHaveBeenCalledWith({
      data: {
        ...schedule,
        date: expect.any(Date),
        createdById: userHelper.getUser().id,
        updatedById: userHelper.getUser().id,
      },
    });

    expect(newSchedule.id).toEqual('sampleId');
  });

  it('should find all schedules', async () => {
    const allSchedules = await service.findAll();

    expect(prismaService.schedule.findMany).toHaveBeenCalled();

    expect(allSchedules.length).toEqual(1);
  });

  it('should find facilities by schedule', async () => {
    const findByFacility: FindByFacilityDto = {
      facilityId: 'facilityId',
    };

    const schedules = await service.findByFacility(findByFacility.facilityId);

    expect(prismaService.schedule.findMany).toHaveBeenCalledWith({
      where: {
        facilityId: findByFacility.facilityId,
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    expect(schedules.length).toEqual(1);
  });

  it('should update a schedule', async () => {
    const updateSchedule: UpdateScheduleDto = {
      id: 'sampleId',
      title: 'Test Schedule Edit',
    };

    const update = await service.updateSchedule(updateSchedule);

    expect(prismaService.schedule.update).toHaveBeenCalledWith({
      where: {
        id: updateSchedule.id,
      },

      data: {
        title: updateSchedule.title,
        motherId: undefined,
        updatedById: userHelper.getUser().id,
      },
    });

    expect(update.title).toEqual(updateSchedule.title);
  });
});
