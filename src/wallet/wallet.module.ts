import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserHelper } from 'src/helpers/user-helper';
import { UsersService } from 'src/users/users.service';
import { SendsmsService } from 'src/sendsms/sendsms.service';
import { DatePicker } from 'src/helpers/date-picker';
import { AuthMiddleware } from 'src/middleware/auth/auth.middleware';
import { WalletcodeverificationMiddleware } from './middleware/walletcodeverification/walletcodeverification.middleware';

@Module({
  controllers: [WalletController],
  providers: [WalletService, PrismaService, UserHelper, UsersService, SendsmsService, DatePicker]
})
export class WalletModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(WalletController);
    consumer.apply(WalletcodeverificationMiddleware).forRoutes({
      method: RequestMethod.POST,
      path: '/wallet/transact'
    });
  }
}
