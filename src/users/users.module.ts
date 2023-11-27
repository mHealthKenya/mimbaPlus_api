import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';
import { PrismaService } from '../prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserHelper } from '../helpers/user-helper';
import { LoginMiddleware } from 'src/middleware/auth/login.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UserHelper],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: '/users/login',
          method: RequestMethod.POST,
        },
        {
          path: '/users/passwordrequest',
          method: RequestMethod.POST,
        },
        {
          path: '/users/resetpassword',
          method: RequestMethod.POST,
        },
      )
      .forRoutes(UsersController);

    consumer.apply(LoginMiddleware).forRoutes({
      path: '/users/login',
      method: RequestMethod.POST,
    });
  }
}
