import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { CommunicationController } from './communication.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserHelper } from 'src/helpers/user-helper';

@Module({
  controllers: [CommunicationController],
  providers: [CommunicationService, PrismaService, UserHelper]
})
export class CommunicationModule { }
