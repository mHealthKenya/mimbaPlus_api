import { Test, TestingModule } from '@nestjs/testing';
import { ClinicvisitService } from './clinicvisit.service';

describe('ClinicvisitService', () => {
  let service: ClinicvisitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicvisitService],
    }).compile();

    service = module.get<ClinicvisitService>(ClinicvisitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
