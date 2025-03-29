import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AdmissionsModule } from './admissions/admissions.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BiodataModule } from './biodata/biodata.module';
import { BirthplanModule } from './birthplan/birthplan.module';
import { ClinicvisitModule } from './clinicvisit/clinicvisit.module';
import { ConsentModule } from './consent/consent.module';
import { DischargeModule } from './discharge/discharge.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { FollowupModule } from './followup/followup.module';
import { PrismaService } from './prisma/prisma.service';
import { SchedulesModule } from './schedules/schedules.module';
import { SendsmsModule } from './sendsms/sendsms.module';
import { StatsModule } from './stats/stats.module';
import { TargetsModule } from './targets/targets.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommunicationModule } from './communication/communication.module';
import { MessagesModule } from './messages/messages.module';
import * as express from 'express';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '..', 'uploads/**'),
      serveRoot: '/uploads'
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    FacilitiesModule,
    BiodataModule,
    SchedulesModule,
    FollowupModule,
    ClinicvisitModule,
    BirthplanModule,
    ConsentModule,
    TargetsModule,
    SendsmsModule,
    EnquiriesModule,
    StatsModule,
    WalletModule,
    AdmissionsModule,
    DischargeModule,
    CommunicationModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(express.static(join(__dirname, '..', 'uploads')))
      .forRoutes('/uploads');
  }
} 
