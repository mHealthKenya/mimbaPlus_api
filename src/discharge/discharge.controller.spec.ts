import { Test, TestingModule } from '@nestjs/testing';
import { DischargeController } from './discharge.controller';
import { DischargeService } from './discharge.service';

describe('DischargeController', () => {
  let controller: DischargeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DischargeController],
      providers: [DischargeService],
    }).compile();

    controller = module.get<DischargeController>(DischargeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
