import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { SchedulesService } from './schedules.service';
import { RolesGuard } from '../guards/roles/roles.guard';
import { UserRoles } from '../decorators/roles/roles.decorator';
import { Roles } from '../users/users.service';
import { FindByFacilityDto } from './dto/find-by-facility.dto';
import { UpdateFacilityDto } from '../facilities/dto/update-facility.dto';
import { FindByMotherIdDto } from './dto/find-by-motherid.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Post('create')
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('all')
  findAll() {
    return this.schedulesService.findAll();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('facility')
  findByFacility(@Query() data: FindByFacilityDto) {
    return this.schedulesService.findByFacility(data.facilityId);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('mother')
  findByMotherId(@Query() data: FindByMotherIdDto) {
    return this.schedulesService.findByMotherId(data.motherId);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Patch('update')
  updateSchedule(@Body() data: UpdateFacilityDto) {
    return this.schedulesService.updateSchedule(data);
  }
}
