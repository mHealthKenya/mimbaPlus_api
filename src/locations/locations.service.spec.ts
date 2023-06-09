import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';

describe('LocationsService', () => {
  let service: LocationsService;
  const prisma = {
    locationsCovered: {
      create: jest.fn().mockImplementation(async () => ({
        id: '12345678',
        location_name: 'sample',
        createdAt: new Date(),
        updatedAt: new Date(),
      })),

      findMany: jest.fn().mockImplementation(async () => [
        {
          id: '12345678',
          location_name: 'sample',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    service = module.get<LocationsService>(LocationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a location', async () => {
    const location: CreateLocationDto = {
      location_name: 'sample',
    };

    const newLocation = await service.create(location);

    expect(newLocation).toEqual({
      id: '12345678',
      location_name: 'sample',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(prisma.locationsCovered.create).toHaveBeenCalledWith({
      data: location,
    });
  });

  it('should find all locations', async () => {
    const allLocations = await service.findAll();
    expect(allLocations.length).toEqual(1);
    expect(prisma.locationsCovered.findMany).toHaveBeenCalled();
  });
});
