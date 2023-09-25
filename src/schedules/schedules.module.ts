import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FollowupService } from 'src/followup/followup.service';
import { UserHelper } from '../helpers/user-helper';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { PrismaService } from '../prisma/prisma.service';
import { SendsmsService } from '../sendsms/sendsms.service';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

@Module({
  controllers: [SchedulesController],
  providers: [
    SchedulesService,
    PrismaService,
    UserHelper,
    FollowupService,
    SendsmsService,
  ],
})
export class SchedulesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(SchedulesController);
  }
}
