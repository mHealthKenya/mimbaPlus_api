import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateManagementDto } from './dto/create-management.dto';
import { Roles, UsersService } from './users.service';
import { LoginManagementDto } from './dto/login-management.dto';
import { RolesGuard } from '../guards/roles/roles.guard';
import { UserRoles } from '../decorators/roles/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Post('management')
  async createManagement(@Body() createManagement: CreateManagementDto) {
    return this.usersService.createManagement(createManagement);
  }

  @Post('login')
  async loginManagement(@Body() credentials: LoginManagementDto) {
    return this.usersService.loginManagement(credentials);
  }
}
