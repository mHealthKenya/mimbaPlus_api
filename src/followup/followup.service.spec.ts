import { Test, TestingModule } from '@nestjs/testing';
import { FollowupService } from './followup.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFollowupDto } from './dto/create-followup.dto';
import { UpdateFollowupDto } from './dto/update-followup.dto';
import { UserHelper } from '../helpers/user-helper';

const prismaService = {
  followUp: {
    create: jest.fn().mockImplementation(async () => ({
      id: ' sampleid',
      scheduleId: 'samplescheduleid',
      chvId: 'samplechvid',
      status: 'Sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),

    update: jest.fn().mockImplementation(async () => ({
      id: ' sampleid',
      scheduleId: 'samplescheduleid',
      chvId: 'samplechvid',
      status: 'Completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  },

  schedule: {
    update: jest.fn().mockImplementation(async () => ({
      id: 'sampleid',
      title: 'Test Schedule Edit',
      description: ' A test schedule',
      facilityId: 'facilityId',
      date: new Date(),
      status: 'Sent',
      motherId: 'motherId',
      createdById: 'createdById',
      updatedById: 'createdById',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  },

  user: {
    findUnique: jest.fn().mockImplementation(async () => ({
      id: 'sampleid',
      f_name: 'User',
      l_name: 'Here',
      gender: 'Male',
      email: 'sample@user.com',
      phone_number: '254123456789',
      national_id: '12345678',
      password: 'hashed',
      role: 'CHV',
      facilityId: 'facilityId',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  },

  $transaction: jest.fn().mockImplementation(async () => ({
    status: 'success',
    message: 'Follow up request successfully sent',
  })),
};

describe('FollowupService', () => {
  let service: FollowupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowupService, PrismaService, UserHelper],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

    service = module.get<FollowupService>(FollowupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a follow up request', async () => {
    const dto: CreateFollowupDto = {
      scheduleId: 'samplescheduleid',
      chvId: 'samplechvid',
    };

    const newSchedule = await service.create(dto);

    expect(prismaService.followUp.create).toHaveBeenCalledWith({
      data: dto,
    });

    expect(newSchedule.status).toEqual('success');
  });

  it('should complete a request', async () => {
    const dto: UpdateFollowupDto = {
      id: 'sampleid',
    };

    const updated = await service.completeFollowUp(dto.id);

    expect(prismaService.followUp.update).toHaveBeenCalledWith({
      where: {
        id: dto.id,
      },

      data: {
        status: 'Completed',
      },
    });

    expect(updated.status).toEqual('Completed');
  });
});
