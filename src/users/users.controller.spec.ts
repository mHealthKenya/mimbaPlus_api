import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Reflector } from '@nestjs/core';
import { UserHelper } from '../helpers/user-helper';
import { CreateManagementDto } from './dto/create-management.dto';

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
  };

  const userDto: CreateManagementDto = {
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
    const nUser = await controller.createManagement(userDto);

    expect(nUser.message).toEqual('User created successfully');
    expect(usersService.createManagement).toHaveBeenCalledWith(userDto);
  });
});
