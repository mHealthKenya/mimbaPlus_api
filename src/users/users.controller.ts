import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRoles } from '../decorators/roles/roles.decorator';
import { LevelGuard } from '../guards/level/level.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserByRole } from './dto/get-user-by-role.dto';
import { LoginManagementDto } from './dto/login-management.dto';
import { Roles, UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserByRoleAndFacility } from './dto/get-user-by-role-and-facility.dto';
import { GetUserById } from './dto/get-user-by-id.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { GetUserDto } from './dto/get-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.CHV, Roles.ADMIN)
  @Post('add')
  async createUser(@Body() createUser: CreateUserDto) {
    return this.usersService.createUser(createUser);
  }

  @Post('login')
  async loginManagement(@Body() credentials: LoginManagementDto) {
    return this.usersService.loginManagement(credentials);
  }

  @UseGuards(LevelGuard)
  @Patch('update')
  async updateManagement(@Body() data: UpdateUserDto) {
    return this.usersService.updateUser(data);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('all')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN, Roles.FACILITY)
  @Get('roles')
  getUsersByRole(@Query() data: GetUserByRole) {
    return this.usersService.getUsersByRole(data);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN, Roles.FACILITY)
  @Get('roleandfacility')
  getUserByRoleAndFacility(@Query() data: GetUserByRoleAndFacility) {
    return this.usersService.getUserByRoleAndFacility(data);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN, Roles.FACILITY)
  @Get('user')
  getUserById(@Query() data: GetUserById) {
    return this.usersService.getUserById(data.id);
  }

  @Post('passwordrequest')
  passwordResetRequest(@Body() data: PasswordResetRequestDto) {
    return this.usersService.passwordResetRequest(data.email);
  }

  @Post('resetpassword')
  resetPassword(@Body() data: UpdatePasswordDto) {
    return this.usersService.resetPassword(data);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.CHV)
  @Get('chvmothers')
  findCHVMothers() {
    return this.usersService.findCHVMothers();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('count')
  countUser() {
    return this.usersService.allUsers();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('rolescount')
  countUserRoles() {
    return this.usersService.usersByRole();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('facilitydistribution')
  facilityDistribution() {
    return this.usersService.usersByFacility();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('facilitychvdistribution')
  facilityCHDistribution() {
    return this.usersService.chVsByFacility();
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('distribution')
  userDistribution() {
    return this.usersService.countUsersByRole();
  }

  @Get('individual')
  getIndividual() {
    return this.usersService.getUser();
  }

  @Get('mothers-registered')
  getMothersRegistered(@Query() data: GetUserDto) {
    return this.usersService.mothersRegistered(data)
  }
}
