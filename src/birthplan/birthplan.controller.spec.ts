import { Test, TestingModule } from '@nestjs/testing';
import { BirthplanController } from './birthplan.controller';
import { BirthplanService } from './birthplan.service';

describe('BirthplanController', () => {
  let controller: BirthplanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BirthplanController],
      providers: [BirthplanService],
    }).compile();

    controller = module.get<BirthplanController>(BirthplanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
