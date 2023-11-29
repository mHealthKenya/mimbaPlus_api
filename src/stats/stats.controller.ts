import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { RolesGuard } from '../guards/roles/roles.guard';
import { UserRoles } from '../decorators/roles/roles.decorator';
import { Roles } from '../users/users.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('totalvisits')
  getTotalVisits() {
    return this.statsService.visitsCount();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('monthlyvisits')
  getMonthlyVisits() {
    return this.statsService.monthlyVisitsCount();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('totalmothers')
  totalMothers() {
    return this.statsService.totalMothers();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('monthlymothers')
  monthlyRegisteredMothers() {
    return this.statsService.mothersRegisteredMonthly();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('totalchvs')
  totalCHVs() {
    return this.statsService.totalCHVs();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('scheduledist')
  scheduleDistribution() {
    return this.statsService.scheduleDistribution();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.CHV)
  @Get('chvmothers')
  chvMothers() {
    return this.statsService.chvMothersRegistered();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.CHV)
  @Get('chvfollowups')
  chvFollowUps() {
    return this.statsService.chvFollowUpDist();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.CHV)
  @Get('motherschv')
  totalMothersCHV() {
    return this.statsService.chvMothersRegistered();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.CHV)
  @Get('monthlychvmothers')
  chvMothersRegisteredThisMonth() {
    return this.statsService.chvMothersRegisteredMonthly();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.CHV)
  @Get('enquiries')
  enquiries() {
    return this.statsService.totalEnquiries();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.CHV)
  @Get('monthlyenquiries')
  totalEnquiries() {
    return this.statsService.totalMonthlyEnquiries();
  }
}
