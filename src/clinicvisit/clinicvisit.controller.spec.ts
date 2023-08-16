import { Test, TestingModule } from '@nestjs/testing';
import { ClinicvisitController } from './clinicvisit.controller';
import { ClinicvisitService } from './clinicvisit.service';

describe('ClinicvisitController', () => {
  let controller: ClinicvisitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicvisitController],
      providers: [ClinicvisitService],
    }).compile();

    controller = module.get<ClinicvisitController>(ClinicvisitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
