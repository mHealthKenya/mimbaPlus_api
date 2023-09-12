import { Module } from '@nestjs/common';
import { BirthplanService } from './birthplan.service';
import { BirthplanController } from './birthplan.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BirthplanController],
  providers: [BirthplanService, PrismaService],
})
export class BirthplanModule {}
