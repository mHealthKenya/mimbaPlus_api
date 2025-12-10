import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VisitCountService } from './visit-count.service';
import { VisitCountController } from './visit-count.controller';
import { AuthMiddleware } from 'src/middleware/auth/auth.middleware';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserHelper } from 'src/helpers/user-helper';

@Module({
  controllers: [VisitCountController],
  providers: [VisitCountService, PrismaService, UserHelper],
})
export class VisitCountModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(VisitCountController);
  }
}
