import { Controller, Get } from '@nestjs/common';
import { SendsmsService } from './sendsms.service';

@Controller('sms')
export class SendsmsController {
  constructor(private readonly smsService: SendsmsService) {}

  @Get('all')
  handleAllSMS() {
    return this.smsService.findSMS();
  }

  @Get('cost')
  handleTotalCost() {
    return this.smsService.smsCost();
  }

  @Get('stats')
  handleStats() {
    return this.smsService.smsStats();
  }

  @Get('cost/month')
  handleMonthlyCost() {
    return this.smsService.monthlySMSCost();
  }

  @Get('stats/month')
  handleMonthlyStats() {
    return this.smsService.monthlyStats();
  }
}
