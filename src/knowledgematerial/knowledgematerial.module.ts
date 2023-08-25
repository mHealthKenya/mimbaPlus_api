import { Module } from '@nestjs/common';
import { KnowledgematerialService } from './knowledgematerial.service';
import { KnowledgematerialController } from './knowledgematerial.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [KnowledgematerialController],
  providers: [KnowledgematerialService, PrismaService],
})
export class KnowledgematerialModule {}
