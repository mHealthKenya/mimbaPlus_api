import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdmissionsService } from './admissions.service';
import { AdmissionsController } from './admissions.controller';
import { UserHelper } from 'src/helpers/user-helper';
import { UsersService } from 'src/users/users.service';
import { AuthMiddleware } from 'src/middleware/auth/auth.middleware';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendsmsService } from 'src/sendsms/sendsms.service';
import { DatePicker } from 'src/helpers/date-picker';

@Module({
  controllers: [AdmissionsController],
  providers: [AdmissionsService, UserHelper, UsersService, PrismaService, SendsmsService, DatePicker]
})
export class AdmissionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(AdmissionsController);
  }
}
