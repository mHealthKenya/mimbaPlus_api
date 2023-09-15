import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BirthplanService } from './birthplan.service';
import { BirthplanController } from './birthplan.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user-helper';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';

@Module({
  controllers: [BirthplanController],
  providers: [BirthplanService, PrismaService, UserHelper],
})
export class BirthplanModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(BirthplanController);
  }
}
