import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateLocationDto } from './dto/update-location.dto';

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

      update: jest.fn().mockImplementation(async () => ({
        id: '12345678',
        location_name: 'sample',
        createdAt: new Date(),
        updatedAt: new Date(),
      })),

      delete: jest.fn().mockImplementation(async () => ({
        message: 'Location deleted',
      })),
    },

    locationCoordinates: {
      findMany: jest.fn().mockImplementation(async () => [
        {
          id: 'sampleId',
          lat: -1.45,
          lng: 35,
          locationsCoveredId: 'locationId',
          createdAt: '2023-06-15T10:08:27.441Z',
          updatedAt: '2023-06-15T10:08:27.441Z',
        },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationsService, PrismaService, EventEmitter2],
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

  it('should find coordinates', async () => {
    const coordinates = await service.getCoordinates();
    expect(coordinates.length).toEqual(1);
  });

  it('should update a location', async () => {
    const location: UpdateLocationDto = {
      location_name: 'sample',
      id: '12345678',
    };

    const updatedLocation = await service.updateLocationFn(location);

    expect(updatedLocation).toEqual({
      id: '12345678',
      location_name: 'sample',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(prisma.locationsCovered.update).toHaveBeenCalledWith({
      where: {
        id: '12345678',
      },
      data: {
        location_name: location.location_name,
      },
    });
  });

  it('should delete a location', async () => {
    const id = '12345678';
    const del = await service.deleteLocation(id);
    expect(del).toEqual({
      message: 'Location deleted',
    });
    expect(prisma.locationsCovered.delete).toHaveBeenCalledWith({
      where: {
        id,
      },
    });
  });
});
