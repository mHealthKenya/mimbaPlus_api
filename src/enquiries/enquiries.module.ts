import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { EnquiriesController } from './enquiries.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user-helper';
import { AuthMiddleware } from 'src/middleware/auth/auth.middleware';

@Module({
  controllers: [EnquiriesController],
  providers: [EnquiriesService, PrismaService, UserHelper],
})
export class EnquiriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(EnquiriesController);
  }
}
