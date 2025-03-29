import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { SendsmsModule } from 'src/sendsms/sendsms.module';
import { UserHelper } from 'src/helpers/user-helper';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, UsersService],
  imports: [SendsmsModule, UserHelper]
})
export class MessagesModule {}
