import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DischargeService } from './discharge.service';
import { DischargeController } from './discharge.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserHelper } from 'src/helpers/user-helper';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthMiddleware } from 'src/middleware/auth/auth.middleware';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [DischargeController],
  providers: [DischargeService, PrismaService, UserHelper]
})
export class DischargeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(DischargeController);
  }
}
