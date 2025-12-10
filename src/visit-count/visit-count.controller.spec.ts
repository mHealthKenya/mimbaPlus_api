import { Test, TestingModule } from '@nestjs/testing';
import { VisitCountController } from './visit-count.controller';
import { VisitCountService } from './visit-count.service';

describe('VisitCountController', () => {
  let controller: VisitCountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitCountController],
      providers: [VisitCountService],
    }).compile();

    controller = module.get<VisitCountController>(VisitCountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
