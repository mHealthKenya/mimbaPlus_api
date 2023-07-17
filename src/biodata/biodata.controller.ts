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

@Controller('biodata')
export class BiodataController {
  constructor(private readonly biodataService: BiodataService) {}

  @Post('add')
  @UseGuards(MotherPrivateDataGuard)
  create(@Body() createBiodatumDto: CreateBiodatumDto) {
    return this.biodataService.create(createBiodatumDto);
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
}
