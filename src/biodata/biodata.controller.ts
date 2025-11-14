import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BiodataService } from './biodata.service';
import { CreateBiodatumDto } from './dto/create-biodatum.dto';
import { MotherPrivateDataGuard } from '../guards/mother/mother.guard';
import { GetByMotherIdDto } from './dto/get-by-mother-id.dto';
import { UpdateBiodatumDto } from './dto/update-biodatum.dto';
import { FindByFacilityDto } from './dto/find-by-facility';
import { GetByIdDto } from './dto/get-by-id.dto';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { UserRoles } from 'src/decorators/roles/roles.decorator';
import { Roles } from 'src/users/users.service';

@Controller('biodata')
export class BiodataController {
  constructor(private readonly biodataService: BiodataService) {}

  @Post('add')
  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN, Roles.FACILITY)
  create(@Body() createBiodatumDto: CreateBiodatumDto) {
    return this.biodataService.create(createBiodatumDto);
  }

  @Get('byid')
  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  getById(@Query() data: GetByIdDto) {
    return this.biodataService.getById(data.id);
  }

  @Get('id')
  @UseGuards(MotherPrivateDataGuard)
  getByMotherId(@Query() data: GetByMotherIdDto) {
    return this.biodataService.getByMotherId(data.motherId);
  }

  @Patch('update')
  @UseGuards(MotherPrivateDataGuard)
  updateBiodatum(@Body() data: UpdateBiodatumDto) {
    return this.biodataService.updateBiodatum(data);
  }

  @Get('facility')
  getBioDataByFacility(@Query() facility: FindByFacilityDto) {
    return this.biodataService.bioDataByFacility(facility.facilityId);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  allBioData() {
    return this.biodataService.allBioData();
  }
}
