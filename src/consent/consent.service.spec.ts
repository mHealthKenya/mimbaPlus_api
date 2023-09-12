import { Test, TestingModule } from '@nestjs/testing';
import { ConsentService } from './consent.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConsentDto } from './dto/create-consent.dto';

const prismaService = {
  consentForm: {
    create: jest.fn().mockImplementation(async () => ({
      id: 'sampleID',
      userId: 'sampleID',
      accepted: true,
      createdAt: new Date(),
    })),

    findUnique: jest.fn().mockImplementation(async () => ({
      id: 'sampleID',
      userId: 'sampleID',
      accepted: true,
      createdAt: new Date(),
    })),
  },
};

describe('ConsentService', () => {
  let service: ConsentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsentService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

    service = module.get<ConsentService>(ConsentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a consent', async () => {
    const form: CreateConsentDto = {
      userId: 'sampleID',
    };

    const consent = await service.create(form);

    expect(consent.accepted).toEqual(true);
    expect(consent.id).toEqual(expect.any(String));
  });

  it('should find a consent', async () => {
    const form: CreateConsentDto = {
      userId: 'sampleID',
    };

    await service.findOne(form.userId);

    expect(prismaService.consentForm.findUnique).toHaveBeenCalledWith({
      where: {
        userId: form.userId,
      },
    });
  });
});
