import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UserRoles } from 'src/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/users/users.service';

interface SendMessagesDto {
  messageId: string;
  phoneNumbers: string[];
}

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Post('sendMessages')
  async sendMessages(@Body() sendMessagesDto: SendMessagesDto) {
    const { messageId, phoneNumbers } = sendMessagesDto;

    // Call the service method to send SMS
    return this.messagesService.sendMessageToNumbers(messageId, phoneNumbers);
  }
}
