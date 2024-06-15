import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BiodataModule } from './biodata/biodata.module';
import { BirthplanModule } from './birthplan/birthplan.module';
import { ClinicvisitModule } from './clinicvisit/clinicvisit.module';
import { ConsentModule } from './consent/consent.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { FollowupModule } from './followup/followup.module';
import { PrismaService } from './prisma/prisma.service';
import { SchedulesModule } from './schedules/schedules.module';
import { SendsmsModule } from './sendsms/sendsms.module';
import { TargetsModule } from './targets/targets.module';
import { UsersModule } from './users/users.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { StatsModule } from './stats/stats.module';
import { WalletModule } from './wallet/wallet.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
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
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
