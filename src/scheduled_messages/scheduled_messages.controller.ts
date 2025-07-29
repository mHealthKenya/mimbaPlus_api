import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ScheduledMessagesService } from './scheduled_messages.service';
import { CreateScheduledMessageDto } from './dto/create-scheduled_message.dto';
import { UpdateScheduledMessageDto } from './dto/update-scheduled_message.dto';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { UserRoles } from 'src/decorators/roles/roles.decorator';
import { Roles } from 'src/users/users.service';

@Controller('scheduled-messages')
export class ScheduledMessagesController {
  constructor(private readonly scheduledMessageService: ScheduledMessagesService) {}

  // @UseGuards(RolesGuard)
  // @UserRoles(Roles.ADMIN)
  @Post()
  create(@Body() createScheduledMessageDto: CreateScheduledMessageDto) {
    return this.scheduledMessageService.create(createScheduledMessageDto);
  }


  // @UseGuards(RolesGuard)
  // @UserRoles(Roles.ADMIN)
  @Get()
  findAll() {
    return this.scheduledMessageService.findAllScheduledMessage();
  }

  // @UseGuards(RolesGuard)
  // @UserRoles(Roles.ADMIN)
  @Get('sentScheduledMessages')
  findSentScheduledMessages() {
    return this.scheduledMessageService.findAllSentMessages();
  }

  // @UseGuards(RolesGuard)
  // @UserRoles(Roles.ADMIN)
  @Get('unsentScheduledMessages')
  findUnsentScheduledMessages() {
    return this.scheduledMessageService.findAllUnSentMessages();
  }

  // @UseGuards(RolesGuard)
  // @UserRoles(Roles.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduledMessageService.findScheduledMessageById(id);
  }

  // @UseGuards(RolesGuard)
  // @UserRoles(Roles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduledMessageService.removeScheduledMessage(id);
  }
}
