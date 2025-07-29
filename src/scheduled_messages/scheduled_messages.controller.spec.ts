import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledMessagesController } from './scheduled_messages.controller';
import { ScheduledMessagesService } from './scheduled_messages.service';

describe('ScheduledMessagesController', () => {
  let controller: ScheduledMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduledMessagesController],
      providers: [ScheduledMessagesService],
    }).compile();

    controller = module.get<ScheduledMessagesController>(ScheduledMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
