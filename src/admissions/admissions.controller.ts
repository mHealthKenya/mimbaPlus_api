import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserRoles } from 'src/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/users/users.service';
import { AdmissionsService } from './admissions.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { GetAdmissionDto } from './dto/get-admission.dto';

@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) { }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Post()
  create(@Body() createAdmissionDto: CreateAdmissionDto) {
    return this.admissionsService.create(createAdmissionDto);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get()
  findAll() {
    return this.admissionsService.findAll();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('admission')
  findOne(@Query() admission: GetAdmissionDto) {
    return this.admissionsService.findOne(admission);
  }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('facility')
  findFacilityAdmissions() {
    return this.admissionsService.facilityAdmissions();
  }


}
