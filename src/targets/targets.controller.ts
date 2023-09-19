import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UpdateTargetDto } from './dto/update-target.dto';
import { TargetsService } from './targets.service';
import { GetTargetDto } from './dto/get-target.dto';

@Controller('targets')
export class TargetsController {
  constructor(private readonly targetsService: TargetsService) {}

  @Get('all')
  findAll() {
    return this.targetsService.findAll();
  }

  @Get('individual')
  findOne(@Query() { id }: GetTargetDto) {
    return this.targetsService.findOne(id);
  }

  @Patch('update')
  update(@Body() updateTargetDto: UpdateTargetDto) {
    return this.targetsService.update(updateTargetDto);
  }
}
