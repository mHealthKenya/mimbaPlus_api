import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { UserHelper } from '../helpers/user-helper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserByRole } from './dto/get-user-by-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { GetUserByRoleAndFacility } from './dto/get-user-by-role-and-facility.dto';

describe('UsersService', () => {
  const prismaService = {
    user: {
      create: jest.fn().mockImplementation(async () => ({
        id: 'sampleId',
        f_name: 'User',
        l_name: 'Here',
        gender: 'Male',
        email: 'sample@user.com',
        phone_number: '254123456789',
        national_id: '12345678',
        password: 'hashed',
        role: 'Role',
        facilityId: 'facilityId',
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      findUnique: jest.fn().mockImplementation(async () => ({
        id: 'sampleId',
        f_name: 'User',
        l_name: 'Here',
        gender: 'Male',
        email: 'sample@user.com',
        phone_number: '254123456789',
        national_id: '12345678',
        password: 'hashed',
        role: 'Role',
        facilityId: 'facilityId',
        createdAt: new Date(),
        updatedAt: new Date(),
      })),

      update: jest.fn().mockImplementation(async () => ({
        id: 'sampleId',
        f_name: 'User',
        l_name: 'Updated',
        gender: 'Male',
        email: 'sample@user.com',
        phone_number: '254123456789',
        national_id: '12345678',
        password: 'hashed',
        role: 'Role',
        facilityId: 'facilityId',
        createdAt: new Date(),
        updatedAt: new Date(),
      })),

      findMany: jest.fn().mockImplementation(async () => [
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
    },
  };
  const newUserDto: CreateUserDto = {
    f_name: 'User',
    l_name: 'Here',
    gender: 'Male',
    email: 'sample@user.com',
    phone_number: '254123456789',
    national_id: '12345678',
    facilityId: 'facilityId',
    role: 'Role',
  };
  let service: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService, UserHelper, EventEmitter2],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const newUser = await service.createUser(newUserDto);

    expect(newUser.message).toEqual('User created successfully');
  });

  it('should update a user', async () => {
    const updateDto: UpdateUserDto = {
      id: 'sampleId',
      l_name: 'Updated',
    };
    const updateUser = await service.updateUser(updateDto);

    expect(updateUser.message).toEqual('User updated successfully');
    expect(prismaService.user.update).toHaveBeenCalledWith({
      where: {
        id: 'sampleId',
      },
      data: {
        id: 'sampleId',
        l_name: 'Updated',
      },
    });
  });

  it('should find users by roles', async () => {
    const data: GetUserByRole = {
      role: 'Role',
    };

    const users = await service.getUsersByRole(data);

    expect(users.length).toEqual(1);
  });

  it('should find users by facilityId and role', async () => {
    const data: GetUserByRoleAndFacility = {
      facilityId: 'facilityId',
      role: 'Role',
    };

    const users = await service.getUserByRoleAndFacility(data);

    expect(users.length).toEqual(1);
  });

  it('should find all users', async () => {
    const allUsers = await service.getAllUsers();

    expect(prismaService.user.findMany).toHaveBeenCalledWith({
      include: {
        Facility: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    expect(allUsers.length).toEqual(1);
  });
});
