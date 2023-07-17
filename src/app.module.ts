import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacilitiesModule } from './facilities/facilities.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { BiodataModule } from './biodata/biodata.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({
      maxListeners: 100,
    }),
    FacilitiesModule,
    BiodataModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
