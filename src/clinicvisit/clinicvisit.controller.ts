import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRoles } from '../decorators/roles/roles.decorator';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Roles } from '../users/users.service';
import { ClinicvisitService } from './clinicvisit.service';
import { CreateClinicvisitDto } from './dto/create-clinicvisit.dto';
import { LatestVisitDto } from './dto/latest-visit.dto';
import { UpdateClinicvisitDto } from './dto/update-clinicvisit.dto';
import { VisitsByBioDataDto } from './dto/visit-by-bio';
import { GetVisitsByFacilityDto } from './dto/visits-by-facility-id.dto';

@Controller('clinicvisit')
export class ClinicvisitController {
  constructor(private readonly clinicvisitService: ClinicvisitService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Post('add')
  create(@Body() createClinicvisitDto: CreateClinicvisitDto) {
    return this.clinicvisitService.create(createClinicvisitDto);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('all')
  findAll() {
    return this.clinicvisitService.findAll();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('facility')
  findByFacility(@Query() facility: GetVisitsByFacilityDto) {
    return this.clinicvisitService.findVisitsByFacility(facility.facilityId);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('latest')
  findLatestVisit(@Query() data: LatestVisitDto) {
    return this.clinicvisitService.findLatest(data.bioDataId);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('bio')
  findByBioData(@Query() data: VisitsByBioDataDto) {
    return this.clinicvisitService.findVisitsByBioData(data.bioDataId);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Patch('update')
  update(@Body() updateClinicvisitDto: UpdateClinicvisitDto) {
    return this.clinicvisitService.update(updateClinicvisitDto);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('count')
  count() {
    return this.clinicvisitService.countVisits();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('visits/count')
  countVisit() {
    return this.clinicvisitService.visitByFacility();
  }
}
