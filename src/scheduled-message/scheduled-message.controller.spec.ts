import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledMessageController } from './scheduled-message.controller';
import { ScheduledMessageService } from './scheduled-message.service';

describe('ScheduledMessageController', () => {
  let controller: ScheduledMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduledMessageController],
      providers: [ScheduledMessageService],
    }).compile();

    controller = module.get<ScheduledMessageController>(ScheduledMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
