import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserHelper } from '../helpers/user-helper';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { PrismaService } from '../prisma/prisma.service';
import { SendsmsService } from '../sendsms/sendsms.service';
import { FollowupController } from './followup.controller';
import { FollowupService } from './followup.service';
import { DatePicker } from '../helpers/date-picker';

@Module({
  controllers: [FollowupController],
  providers: [
    FollowupService,
    PrismaService,
    UserHelper,
    SendsmsService,
    DatePicker,
  ],
})
export class FollowupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(FollowupController);
  }
}
