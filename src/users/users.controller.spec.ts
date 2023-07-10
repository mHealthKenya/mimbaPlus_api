import { Reflector } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { UserHelper } from '../helpers/user-helper';
import { PrismaService } from '../prisma/prisma.service';
import { GetUserByRole } from './dto/get-user-by-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserByRoleAndFacility } from './dto/get-user-by-role-and-facility.dto';

describe('UsersController', () => {
  let controller: UsersController;
  const usersService = {
    createUser: jest.fn().mockImplementation(async () => ({
      message: 'User created successfully',
      data: {
        id: 'sampleId',
        f_name: 'User',
        l_name: 'Here',
        locationsCoveredId: 'sampleLocation',
        gender: 'Male',
        email: 'sample@user.com',
        phone_number: '254123456789',
        national_id: '12345678',
        password: 'hashed',
        role: 'Role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })),

    updateUser: jest.fn().mockImplementation(async () => ({
      message: 'User updated successfully',
      data: {
        id: 'sampleId',
        f_name: 'User',
        l_name: 'Updated',
        locationsCoveredId: 'sampleLocation',
        gender: 'Male',
        email: 'sample@user.com',
        phone_number: '254123456789',
        national_id: '12345678',
        password: 'hashed',
        role: 'Role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })),

    getUsersByRole: jest.fn().mockImplementation(async () => [
      {
        id: 'sampleId',
        f_name: 'User',
        l_name: 'Updated',
        locationsCoveredId: 'sampleLocation',
        gender: 'Male',
        email: 'sample@user.com',
        phone_number: '254123456789',
        national_id: '12345678',
        password: 'hashed',
        role: 'Role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

    getUserByRoleAndFacility: jest.fn().mockImplementation(async () => [
      {
        id: 'sampleId',
        f_name: 'User',
        l_name: 'Updated',
        facilityId: 'facilityId',
        gender: 'Male',
        email: 'sample@user.com',
        phone_number: '254123456789',
        national_id: '12345678',
        password: 'hashed',
        role: 'Role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

    getAllUsers: jest.fn().mockImplementation(async () => [
      {
        id: 'sampleId',
        f_name: 'User',
        l_name: 'Updated',
        facilityId: 'facilityId',
        gender: 'Male',
        email: 'sample@user.com',
        phone_number: '254123456789',
        national_id: '12345678',
        password: 'hashed',
        role: 'Role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  };

  const newUserDto: CreateUserDto = {
    f_name: 'User',
    l_name: 'Here',
    gender: 'Male',
    email: 'sample@user.com',
    phone_number: '254123456789',
    national_id: '12345678',
    role: 'Admin',
    facilityId: 'sample',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        PrismaService,
        UserHelper,
        EventEmitter2,
        Reflector,
      ],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const newUser = await controller.createUser(newUserDto);
    expect(newUser.message).toEqual('User created successfully');
    expect(usersService.createUser).toHaveBeenCalledWith(newUserDto);
  });

  it('should update a user', async () => {
    const user: UpdateUserDto = {
      id: 'sampleId',
      l_name: 'Updated',
    };

    const updateUser = await controller.updateManagement(user);

    expect(updateUser.message).toEqual('User updated successfully');

    expect(usersService.updateUser).toHaveBeenCalledWith(user);
  });

  it('should get users by role', async () => {
    const data: GetUserByRole = {
      role: 'Role',
    };
    const users = await controller.getUsersByRole(data);

    expect(users.length).toEqual(1);

    expect(usersService.getUsersByRole).toHaveBeenCalledWith(data);
  });

  it('should get users by facilityId and role', async () => {
    const data: GetUserByRoleAndFacility = {
      facilityId: 'facilityId',
      role: 'Role',
    };
    const users = await controller.getUserByRoleAndFacility(data);

    expect(users.length).toEqual(1);

    expect(usersService.getUserByRoleAndFacility).toHaveBeenCalledWith(data);
  });

  it('should get all users', async () => {
    const users = await controller.getAllUsers();
    expect(usersService.getAllUsers).toHaveBeenCalled();
    expect(users.length).toEqual(1);
  });
});
