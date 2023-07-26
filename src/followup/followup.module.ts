import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FollowupService } from './followup.service';
import { FollowupController } from './followup.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { UserHelper } from '../helpers/user-helper';

@Module({
  controllers: [FollowupController],
  providers: [FollowupService, PrismaService, UserHelper],
})
export class FollowupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(FollowupController);
  }
}
