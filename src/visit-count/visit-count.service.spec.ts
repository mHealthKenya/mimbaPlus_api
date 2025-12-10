import { Test, TestingModule } from '@nestjs/testing';
import { VisitCountService } from './visit-count.service';

describe('VisitCountService', () => {
  let service: VisitCountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitCountService],
    }).compile();

    service = module.get<VisitCountService>(VisitCountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
