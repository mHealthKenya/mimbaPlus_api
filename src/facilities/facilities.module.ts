import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user-helper';

@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService, PrismaService, UserHelper],
})
export class FacilitiesModule {}
