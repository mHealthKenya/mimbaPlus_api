import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgematerialController } from './knowledgematerial.controller';
import { KnowledgematerialService } from './knowledgematerial.service';

describe('KnowledgematerialController', () => {
  let controller: KnowledgematerialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnowledgematerialController],
      providers: [KnowledgematerialService],
    }).compile();

    controller = module.get<KnowledgematerialController>(KnowledgematerialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
