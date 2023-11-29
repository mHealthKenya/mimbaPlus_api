import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PrismaService } from '../prisma/prisma.service';
import { DatePicker } from '../helpers/date-picker';
import { UserHelper } from '../helpers/user-helper';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';

@Module({
  controllers: [StatsController],
  providers: [StatsService, PrismaService, DatePicker, UserHelper],
})
export class StatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(StatsController);
  }
}
