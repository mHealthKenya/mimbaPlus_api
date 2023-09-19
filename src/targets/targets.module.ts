import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TargetsService } from './targets.service';
import { TargetsController } from './targets.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { UserHelper } from '../helpers/user-helper';

@Module({
  controllers: [TargetsController],
  providers: [TargetsService, PrismaService, UserHelper],
})
export class TargetsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(TargetsController);
  }
}
