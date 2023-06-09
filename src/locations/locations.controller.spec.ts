import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';

describe('LocationsController', () => {
  const service = {
    create: jest.fn().mockImplementation(async () => ({
      id: '12345678',
      location_name: 'sample',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),

    findAll: jest.fn().mockImplementation(async () => [
      {
        id: '12345678',
        location_name: 'sample',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  };
  let controller: LocationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [LocationsService, PrismaService],
    })
      .overrideProvider(LocationsService)
      .useValue(service)
      .compile();

    controller = module.get<LocationsController>(LocationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a location', async () => {
    const location: CreateLocationDto = {
      location_name: 'sample',
    };

    const newLocation = await controller.create(location);

    expect(newLocation).toEqual({
      id: '12345678',
      location_name: 'sample',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(service.create).toHaveBeenCalledWith(location);
  });

  it('should find all locations', async () => {
    const allLocations = await controller.findAll();
    expect(allLocations).toEqual([
      {
        id: '12345678',
        location_name: 'sample',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ]);

    expect(service.findAll).toHaveBeenCalled();
  });
});