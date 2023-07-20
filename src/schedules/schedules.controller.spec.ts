import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { UserHelper } from '../helpers/user-helper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { FindByFacilityDto } from './dto/find-by-facility.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

const scheduleService = {
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

  findAll: jest.fn().mockImplementation(async () => [
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

  findByFacility: jest.fn().mockImplementation(async () => [
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

  updateSchedule: jest.fn().mockImplementation(async () => ({
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
};

describe('SchedulesController', () => {
  let controller: SchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [SchedulesService, UserHelper, PrismaService],
    })
      .overrideProvider(SchedulesService)
      .useValue(scheduleService)
      .compile();

    controller = module.get<SchedulesController>(SchedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a schedule', async () => {
    const schedule: CreateScheduleDto = {
      title: 'Test Schedule',
      description: ' A test schedule',
      facilityId: 'facilityId',
      date: '2023-07-21 10:00',
      motherId: 'motherId',
    };

    const newSchedule = await controller.create(schedule);

    expect(scheduleService.create).toHaveBeenCalledWith(schedule);

    expect(newSchedule.id).toEqual('sampleId');
  });

  it('should find all schedules', async () => {
    const allSchedules = await controller.findAll();
    expect(scheduleService.findAll).toHaveBeenCalled();
    expect(allSchedules.length).toEqual(1);
  });

  it('should find all schedules by facility', async () => {
    const findByFacility: FindByFacilityDto = {
      facilityId: 'facilityId',
    };

    const schedules = await controller.findByFacility(findByFacility);

    expect(scheduleService.findByFacility).toHaveBeenCalledWith(
      findByFacility.facilityId,
    );

    expect(schedules.length).toEqual(1);
  });

  it('should update a schedule', async () => {
    const updateSchedule: UpdateScheduleDto = {
      id: 'sampleId',
      title: 'Test Schedule Edit',
    };

    const update = await controller.updateSchedule(updateSchedule);

    expect(scheduleService.updateSchedule).toHaveBeenCalledWith(updateSchedule);

    expect(update.id).toEqual(updateSchedule.id);
  });
});
