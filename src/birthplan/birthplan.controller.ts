import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BirthplanService } from './birthplan.service';
import { CreateBirthplanDto } from './dto/create-birthplan.dto';
import { RolesGuard } from '../guards/roles/roles.guard';
import { UserRoles } from '../decorators/roles/roles.decorator';
import { Roles } from '../users/users.service';
import { FindByFacilityDto } from './dto/find-by-facility.dto';
import { GetByMotherDto } from './dto/get-by-id.dto';
import { UpdateBirthplanDto } from './dto/update-birthplan.dto';

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

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Get('mother')
  getByFacility(@Query() { motherId }: GetByMotherDto) {
    return this.birthplanService.getByMotherId(motherId);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Patch('update')
  updateBirthPlan(@Body() data: UpdateBirthplanDto) {
    return this.birthplanService.updateBirthPlan(data);
  }
}
