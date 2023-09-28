import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClinicvisitService } from './clinicvisit.service';
import { ClinicvisitController } from './clinicvisit.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user-helper';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { DatePicker } from '../helpers/date-picker';

@Module({
  controllers: [ClinicvisitController],
  providers: [ClinicvisitService, PrismaService, UserHelper, DatePicker],
})
export class ClinicvisitModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ClinicvisitController);
  }
}
