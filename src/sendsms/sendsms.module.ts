import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserHelper } from 'src/helpers/user-helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendsmsController } from './sendsms.controller';
import { SendsmsService } from './sendsms.service';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { DatePicker } from '../helpers/date-picker';

@Module({
  controllers: [SendsmsController],
  providers: [PrismaService, UserHelper, SendsmsService, DatePicker],
  exports: [SendsmsService],
})
export class SendsmsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(SendsmsController);
  }
}
