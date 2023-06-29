import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user-helper';
import { AuthMiddleware } from 'src/middleware/auth/auth.middleware';

@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService, PrismaService, UserHelper],
})
export class FacilitiesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: '/facilities/all',
          method: RequestMethod.GET,
        },
        {
          path: '/facilities/coordinates',
          method: RequestMethod.GET,
        },
      )
      .forRoutes(FacilitiesController);
  }
}
