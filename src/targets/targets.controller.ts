import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { GetTargetDto } from './dto/get-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';
import { TargetsService } from './targets.service';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { UserRoles } from 'src/decorators/roles/roles.decorator';
import { Roles } from 'src/users/users.service';

@Controller('targets')
export class TargetsController {
  constructor(private readonly targetsService: TargetsService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('all')
  findAll() {
    return this.targetsService.findAll();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('individual')
  findOne(@Query() { id }: GetTargetDto) {
    return this.targetsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Patch('update')
  update(@Body() updateTargetDto: UpdateTargetDto) {
    return this.targetsService.update(updateTargetDto);
  }
}
