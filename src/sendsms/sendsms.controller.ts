import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ScheduleSMSDto, SendsmsService, SMSProps } from './sendsms.service';
import { RolesGuard } from '../guards/roles/roles.guard';
import { UserRoles } from '../decorators/roles/roles.decorator';
import { Roles } from '../users/users.service';
import { Schedule } from '@prisma/client';

@Controller('sms')
export class SendsmsController {
  constructor(private readonly smsService: SendsmsService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('all')
  handleAllSMS() {
    return this.smsService.findSMS();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('cost')
  handleTotalCost() {
    return this.smsService.smsCost();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('stats')
  handleStats() {
    return this.smsService.smsStats();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('cost/month')
  handleMonthlyCost() {
    return this.smsService.monthlySMSCost();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('stats/month')
  handleMonthlyStats() {
    return this.smsService.monthlyStats();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('count/month')
  monthlySMS() {
    return this.smsService.monthlySMS();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('count/all')
  allSMSCount() {
    return this.smsService.allSMSCount();
  }

  @Post('scheduled-messages')
  sendSMSMultipleNumbersFn(@Body() data: ScheduleSMSDto) {
    const smsData: SMSProps[] = data.phoneNumbers.map((phoneNumber) => ({
      phoneNumber,
      message: data.message,
    }));
    return this.smsService.sendSMSMultipleNumbersFn(smsData);
  }

  
}
