import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { BirthplanService } from './birthplan.service';
import { CreateBirthplanDto } from './dto/create-birthplan.dto';
import { RolesGuard } from '../guards/roles/roles.guard';
import { UserRoles } from '../decorators/roles/roles.decorator';
import { Roles } from '../users/users.service';
import { FindByFacilityDto } from './dto/find-by-facility.dto';

@Controller('birthplan')
export class BirthplanController {
  constructor(private readonly birthplanService: BirthplanService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Post('add')
  create(@Body() createBirthplanDto: CreateBirthplanDto) {
    return this.birthplanService.create(createBirthplanDto);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('facility')
  findByFacility(@Query() data: FindByFacilityDto) {
    return this.birthplanService.findByFacility(data.facilityId);
  }
}
