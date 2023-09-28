import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserRoles } from '../decorators/roles/roles.decorator';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Roles } from '../users/users.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { EnquiriesService } from './enquiries.service';

@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.CHV)
  @Post('add')
  create(@Body() createEnquiryDto: CreateEnquiryDto) {
    return this.enquiriesService.create(createEnquiryDto);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('facility')
  findByFacility() {
    return this.enquiriesService.findByFacility();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Patch('reply')
  replyToEnquiry(@Body() data: UpdateEnquiryDto) {
    return this.enquiriesService.replyToEnquiry(data);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.CHV)
  @Get('chv')
  getCHVEnquiries() {
    return this.enquiriesService.findCHVEnquiries();
  }
}
