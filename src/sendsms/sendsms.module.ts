import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserHelper } from 'src/helpers/user-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendsmsController } from './sendsms.controller';
import { SendsmsService } from './sendsms.service';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';

@Module({
  controllers: [SendsmsController],
  providers: [PrismaService, UserHelper, SendsmsService],
})
export class SendsmsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(SendsmsController);
  }
}
