import { PrismaService } from './../prisma/prisma.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BiodataService } from './biodata.service';
import { BiodataController } from './biodata.controller';
import { UserHelper } from '../helpers/user-helper';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';

@Module({
  controllers: [BiodataController],
  providers: [BiodataService, PrismaService, UserHelper],
})
export class BiodataModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(BiodataController);
  }
}
