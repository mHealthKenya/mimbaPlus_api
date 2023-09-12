import { Test, TestingModule } from '@nestjs/testing';
import { ConsentController } from './consent.controller';
import { ConsentService } from './consent.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConsentDto } from './dto/create-consent.dto';

const consentService = {
  create: jest.fn().mockImplementation(async () => ({
    id: 'sampleID',
    userId: 'sampleID',
    accepted: true,
    createdAt: new Date(),
  })),

  findOne: jest.fn().mockImplementation(async () => ({
    id: 'sampleID',
    userId: 'sampleID',
    accepted: true,
    createdAt: new Date(),
  })),
};

describe('ConsentController', () => {
  let controller: ConsentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsentController],
      providers: [ConsentService, PrismaService],
    })
      .overrideProvider(ConsentService)
      .useValue(consentService)
      .compile();

    controller = module.get<ConsentController>(ConsentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a consent', async () => {
    const form: CreateConsentDto = {
      userId: 'sampleID',
    };

    const consent = await controller.create(form);

    expect(consent.id).toEqual('sampleID');

    expect(consentService.create).toHaveBeenCalledWith(form);
  });

  it('should get a consent form', async () => {
    const form: CreateConsentDto = {
      userId: 'sampleID',
    };

    await controller.findOne(form);

    expect(consentService.findOne).toHaveBeenCalledWith(form.userId);
  });
});
