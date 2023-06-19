import { Reflector } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { UserHelper } from '../helpers/user-helper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManagementDto } from './dto/create-management.dto';
import { UpdateManagementDto } from './dto/update-management.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GetUserByRole } from './dto/get-user-by-role.dto';

describe('UsersController', () => {
  let controller: UsersController;
  const usersService = {
    createManagement: jest.fn().mockImplementation(async () => ({
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
  };

  const newUserDto: CreateManagementDto = {
    f_name: 'User',
    l_name: 'Here',
    locationsCoveredId: 'sampleLocation',
    gender: 'Male',
    email: 'sample@user.com',
    phone_number: '254123456789',
    national_id: '12345678',
    role: 'Role',
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
    const newUser = await controller.createManagement(newUserDto);
    expect(newUser.message).toEqual('User created successfully');
    expect(usersService.createManagement).toHaveBeenCalledWith(newUserDto);
  });

  it('should update a user', async () => {
    const user: UpdateManagementDto = {
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
});
