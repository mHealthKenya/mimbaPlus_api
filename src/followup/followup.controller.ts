import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateFollowupDto } from './dto/create-followup.dto';
import { FollowupService } from './followup.service';
import { RolesGuard } from '../guards/roles/roles.guard';
import { UserRoles } from '../decorators/roles/roles.decorator';
import { Roles } from '../users/users.service';
import { UpdateFollowupDto } from './dto/update-followup.dto';

@Controller('followup')
export class FollowupController {
  constructor(private readonly followupService: FollowupService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
  @Post('create')
  create(@Body() createFollowupDto: CreateFollowupDto) {
    return this.followupService.create(createFollowupDto);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.CHV)
  getFollowUps() {
    return this.followupService.getFollowUps();
  }
  @UseGuards(RolesGuard)
  @UserRoles(Roles.CHV)
  @Patch('update')
  completeFollowUp(@Body() data: UpdateFollowupDto) {
    return this.followupService.completeFollowUp(data.id);
  }
}
