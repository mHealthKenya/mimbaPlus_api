import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { PrismaService } from '../prisma/prisma.service';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { UserHelper } from '../helpers/user-helper';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService, PrismaService, UserHelper],
})
export class LocationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: '/locations/all',
        method: RequestMethod.GET,
      })
      .exclude({
        path: '/locations/coordinates',
        method: RequestMethod.GET,
      })
      .forRoutes(LocationsController);
  }
}
