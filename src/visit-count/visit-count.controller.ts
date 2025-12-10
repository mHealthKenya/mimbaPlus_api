import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VisitCountService } from './visit-count.service';
import { CreateVisitCountDto } from './dto/create-visit-count.dto';
import { UpdateVisitCountDto } from './dto/update-visit-count.dto';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { UserRoles } from 'src/decorators/roles/roles.decorator';
import { Roles } from 'src/users/users.service';

@Controller('visit-count')
export class VisitCountController {
  constructor(private readonly visitCountService: VisitCountService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Post("migrate-from-clinic-visits")
  migrateClinicVisitsToVisitCounter() {
    return this.visitCountService.migrateFromClinicVisits();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Post()
  create(@Body() createVisitCountDto: CreateVisitCountDto) {
    return this.visitCountService.create(createVisitCountDto);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get()
  findAll() {
    return this.visitCountService.findAll();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('total')
  getTotalVisitCount() {
    return this.visitCountService.getTotalVisitCount();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitCountService.findUserVisitById(id);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisitCountDto: UpdateVisitCountDto) {
    return this.visitCountService.update(id, updateVisitCountDto);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitCountService.remove(id);
  }
}
