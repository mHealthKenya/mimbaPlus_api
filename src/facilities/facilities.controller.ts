import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { FacilitiesService } from './facilities.service';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { DeleteFacilityDto } from './dto/delete-facility.dto';
import { RolesGuard } from '../guards/roles/roles.guard';
import { UserRoles } from '../decorators/roles/roles.decorator';
import { Roles } from '../users/users.service';

@Controller('facilities')
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Post('add')
  create(@Body() createFacilityDto: CreateFacilityDto) {
    return this.facilitiesService.create(createFacilityDto);
  }

  @Get('all')
  findAllFacilities() {
    return this.facilitiesService.findAllFacilities();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Patch('update')
  updateFacility(@Body() data: UpdateFacilityDto) {
    return this.facilitiesService.updateFacility(data);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Delete('delete')
  deleteFacility(@Query() data: DeleteFacilityDto) {
    return this.facilitiesService.deleteFacility(data.id);
  }

  @Get('coordinates')
  getCoordinates() {
    return this.facilitiesService.getCoordinates();
  }
}
