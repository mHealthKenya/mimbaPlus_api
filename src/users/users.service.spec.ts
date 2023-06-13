import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { UserHelper } from '../helpers/user-helper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManagementDto } from './dto/create-management.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  const prismaService = {
    user: {
      create: jest.fn().mockImplementation(async () => ({
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
      })),

      findUnique: jest.fn().mockImplementation(async () => ({
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
      })),
    },
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
    const nUser = await service.createManagement(userDto);

    expect(nUser.message).toEqual('User created successfully');

    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: {
        ...userDto,
        password: expect.any(String),
      },
    });
  });
});
