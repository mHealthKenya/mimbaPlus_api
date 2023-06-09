import { Body, Controller, Post } from '@nestjs/common';
import { CreateManagementDto } from './dto/create-management.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('management')
  async createManagement(@Body() createManagement: CreateManagementDto) {
    return this.usersService.createManagement(createManagement);
  }
}
