import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacilitiesModule } from './facilities/facilities.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { BiodataModule } from './biodata/biodata.module';
import { SchedulesModule } from './schedules/schedules.module';
import { FollowupModule } from './followup/followup.module';
import { ClinicvisitModule } from './clinicvisit/clinicvisit.module';
import { BirthplanModule } from './birthplan/birthplan.module';
import { ConsentModule } from './consent/consent.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({
      maxListeners: 100,
    }),
    FacilitiesModule,
    BiodataModule,
    SchedulesModule,
    FollowupModule,
    ClinicvisitModule,
    BirthplanModule,
    ConsentModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
