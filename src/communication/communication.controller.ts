import { Body, Controller, Post } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { SendSMSDto } from './dto/send-sms.dto';

@Controller('communication')
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) { }


  @Post('send-sms')
  async sendSMS(@Body() data: SendSMSDto) {
    return this.communicationService.sendSMS(data);
  }
}
