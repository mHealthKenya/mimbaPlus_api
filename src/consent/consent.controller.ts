import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConsentService } from './consent.service';
import { CreateConsentDto } from './dto/create-consent.dto';

@Controller('consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Post()
  create(@Body() createConsentDto: CreateConsentDto) {
    return this.consentService.create(createConsentDto);
  }

  @Get('byid')
  findOne(@Query() data: CreateConsentDto) {
    return this.consentService.findOne(data.userId);
  }
}
