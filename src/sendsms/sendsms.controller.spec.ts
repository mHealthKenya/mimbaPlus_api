import { Test, TestingModule } from '@nestjs/testing';
import { SendsmsController } from './sendsms.controller';

describe('SendsmsController', () => {
  let controller: SendsmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendsmsController],
    }).compile();

    controller = module.get<SendsmsController>(SendsmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
