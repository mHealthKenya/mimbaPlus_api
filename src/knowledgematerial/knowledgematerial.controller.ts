import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { KnowledgematerialService } from './knowledgematerial.service';
import { CreateKnowledgematerialDto } from './dto/create-knowledgematerial.dto';
import { UpdateKnowledgematerialDto } from './dto/update-knowledgematerial.dto';

@Controller('knowledgematerial')
export class KnowledgematerialController {
  constructor(
    private readonly knowledgematerialService: KnowledgematerialService,
  ) {}

  @Post('add')
  create(@Body() createKnowledgematerialDto: CreateKnowledgematerialDto) {
    return this.knowledgematerialService.create(createKnowledgematerialDto);
  }

  @Post(':id/share')
  async shareKnowledgeMaterial(
    @Param('id', ParseIntPipe) id: string,
    @Body('userIds') userIds: string[],
  ) {
    try {
      const sharedMaterial =
        await this.knowledgematerialService.shareKnowledgeMaterial(id, userIds);
      return {
        message: 'Knowledge material shared successfully',
        data: sharedMaterial,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('all')
  findAll() {
    return this.knowledgematerialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.knowledgematerialService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateKnowledgematerialDto: UpdateKnowledgematerialDto,
  ) {
    return this.knowledgematerialService.update(id, updateKnowledgematerialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.knowledgematerialService.remove(id);
  }
}
