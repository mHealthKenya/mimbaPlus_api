import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BirthplanService } from './birthplan.service';
import { CreateBirthplanDto } from './dto/create-birthplan.dto';
import { UpdateBirthplanDto } from './dto/update-birthplan.dto';

@Controller('birthplan')
export class BirthplanController {
  constructor(private readonly birthplanService: BirthplanService) {}

  @Post()
  create(@Body() createBirthplanDto: CreateBirthplanDto) {
    return this.birthplanService.create(createBirthplanDto);
  }

  @Get()
  findAll() {
    return this.birthplanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.birthplanService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBirthplanDto: UpdateBirthplanDto,
  ) {
    return this.birthplanService.update(+id, updateBirthplanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.birthplanService.remove(+id);
  }
}
