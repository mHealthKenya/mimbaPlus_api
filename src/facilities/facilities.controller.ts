import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { FacilitiesService } from './facilities.service';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { DeleteFacilityDto } from './dto/delete-facility.dto';

@Controller('facilities')
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Post('add')
  create(@Body() createFacilityDto: CreateFacilityDto) {
    return this.facilitiesService.create(createFacilityDto);
  }

  @Get('all')
  findAllFacilities() {
    return this.facilitiesService.findAllFacilities();
  }

  @Patch('update')
  updateFacility(@Body() data: UpdateFacilityDto) {
    return this.facilitiesService.updateFacility(data);
  }

  @Delete('delete')
  deleteFacility(@Query() data: DeleteFacilityDto) {
    return this.facilitiesService.deleteFacility(data.id);
  }

  @Get('coordinates')
  getCoordinates() {
    return this.facilitiesService.getCoordinates();
  }
}
