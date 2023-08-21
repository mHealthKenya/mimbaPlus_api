import { Test, TestingModule } from '@nestjs/testing';
import { FollowupController } from './followup.controller';
import { FollowupService } from './followup.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFollowupDto } from './dto/create-followup.dto';
import { UserHelper } from '../helpers/user-helper';
import { UpdateFollowupDto } from './dto/update-followup.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

const followUpService = {
  create: jest.fn().mockImplementation(async () => ({
    status: 'success',
    message: 'Follow up request successfully sent',
  })),

  completeFollowUp: jest.fn().mockImplementation(async () => ({
    id: ' sampleid',
    scheduleId: 'samplescheduleid',
    chvId: 'samplechvid',
    status: 'Completed',
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
};

describe('FollowupController', () => {
  let controller: FollowupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowupController],
      providers: [FollowupService, PrismaService, UserHelper, EventEmitter2],
    })
      .overrideProvider(FollowupService)
      .useValue(followUpService)
      .compile();

    controller = module.get<FollowupController>(FollowupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a followup', async () => {
    const dto: CreateFollowupDto = {
      scheduleId: 'samplescheduleid',
      chvId: 'samplechvid',
    };

    const followUp = await controller.create(dto);

    expect(followUpService.create).toHaveBeenCalledWith(dto);

    expect(followUp.status).toEqual('success');
  });

  it('should complete a followup', async () => {
    const dto: UpdateFollowupDto = {
      id: 'sampleid',
    };

    const updated = await controller.completeFollowUp(dto);

    expect(followUpService.completeFollowUp).toHaveBeenCalledWith(dto.id);

    expect(updated.status).toEqual('Completed');
  });
});
