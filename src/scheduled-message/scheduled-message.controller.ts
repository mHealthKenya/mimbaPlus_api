import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ScheduledMessageService } from './scheduled-message.service';
import { CreateScheduledMessageDto } from './dto/create-scheduled-message.dto';
import { UpdateScheduledMessageDto } from './dto/update-scheduled-message.dto';
import { ScheduleSMSDto, SMSProps } from 'src/sendsms/sendsms.service';
import { UserRoles } from 'src/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/users/users.service';

@Controller('scheduled-message')
export class ScheduledMessageController {
  constructor(private readonly scheduledMessageService: ScheduledMessageService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Post('scheduled-messages')
  create(@Body() createScheduledMessageDto: CreateScheduledMessageDto) {
    return this.scheduledMessageService.create(createScheduledMessageDto);
  }

  
  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get()
  findAll() {
    return this.scheduledMessageService.findAllScheduledMessage();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('sentScheduledMessages')
  findSentScheduledMessages() {
    return this.scheduledMessageService.findAllSentMessages();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('unsentScheduledMessages')
  findUnsentScheduledMessages() {
    return this.scheduledMessageService.findAllUnSentMessages();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduledMessageService.findScheduledMessageById(id);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduledMessageDto: UpdateScheduledMessageDto) {
    return this.scheduledMessageService.updateScheduledMessage(id, updateScheduledMessageDto);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduledMessageService.removeScheduledMessage(id);
  }

  
}
