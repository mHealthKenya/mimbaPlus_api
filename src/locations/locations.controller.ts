import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserRoles } from '../decorators/roles/roles.decorator';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Roles } from '../users/users.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Post('add')
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get('all')
  findAll() {
    return this.locationsService.findAll();
  }

  @Get('coordinates')
  getCoordinates() {
    return this.locationsService.getCoordinates();
  }
}
