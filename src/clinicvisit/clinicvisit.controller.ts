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
import { GetFacilityByIdDto } from '../facilities/dto/get-facility.dto';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Roles } from '../users/users.service';
import { ClinicvisitService } from './clinicvisit.service';
import { CreateClinicvisitDto } from './dto/create-clinicvisit.dto';
import { LatestVisitDto } from './dto/latest-visit.dto';
import { UpdateClinicvisitDto } from './dto/update-clinicvisit.dto';

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
  findByFacility(@Query() facility: GetFacilityByIdDto) {
    return this.clinicvisitService.findVisitsByFacility(facility.id);
  }

  @Get('latest')
  findLatestVisit(@Query() data: LatestVisitDto) {
    return this.clinicvisitService.findLatest(data.motherId);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Patch('update')
  update(@Body() updateClinicvisitDto: UpdateClinicvisitDto) {
    return this.clinicvisitService.update(updateClinicvisitDto);
  }
}
