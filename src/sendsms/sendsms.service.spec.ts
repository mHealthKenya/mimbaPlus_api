import { Test, TestingModule } from '@nestjs/testing';
import { SendsmsService } from './sendsms.service';

describe('SendsmsService', () => {
  let service: SendsmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendsmsService],
    }).compile();

    service = module.get<SendsmsService>(SendsmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
