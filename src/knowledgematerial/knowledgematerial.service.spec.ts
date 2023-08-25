import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgematerialService } from './knowledgematerial.service';
import { CreateKnowledgematerialDto } from './dto/create-knowledgematerial.dto';

const createKnowledgematerialData: CreateKnowledgematerialDto = {
  name: 'test',
  description: 'test',
};

const prisma = {
  knowledgeMaterial: {
    create: jest.fn().mockImplementation(async () => ({
      id: '1234567890',
      name: 'test',
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    findUnique: jest.fn().mockImplementation(async () => ({
      id: '1234567890',
      name: 'test',
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    update: jest.fn().mockImplementation(async () => ({
      id: '1234567890',
      name: 'test',
      description: 'test1',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  },
},

describe('KnowledgematerialService', () => {
  let service: KnowledgematerialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnowledgematerialService],
    }).compile();

    service = module.get<KnowledgematerialService>(KnowledgematerialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create knowledge Material', async () => {
    const newKnwMaterial = await service.create(createKnowledgematerialData)

    expect(prisma.knowledgeMaterial.create).toHaveBeenCalled();

    expect(newKnwMaterial.id).toEqual('1234567890')
  })
});
