import { Test, TestingModule } from '@nestjs/testing';
import { BirthplanService } from './birthplan.service';

describe('BirthplanService', () => {
  let service: BirthplanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BirthplanService],
    }).compile();

    service = module.get<BirthplanService>(BirthplanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
