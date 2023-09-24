import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user-helper';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { FollowupService } from 'src/followup/followup.service';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService, PrismaService, UserHelper, FollowupService],
})
export class SchedulesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(SchedulesController);
  }
}
