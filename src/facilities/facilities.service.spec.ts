import { Test, TestingModule } from '@nestjs/testing';
import { FacilitiesService } from './facilities.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { DeleteFacilityDto } from './dto/delete-facility.dto';
import { GetFacilityByIdDto } from './dto/get-facility.dto';

const prismaService = {
  facility: {
    create: jest.fn().mockImplementation(async () => ({
      id: 'sampleid',
      name: 'sample facility',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Active',
    })),

    findUnique: jest.fn().mockImplementation(async () => ({
      id: 'sampleid',
      name: 'sample facility',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Active',
    })),

    findMany: jest.fn().mockImplementation(async () => [
      {
        id: 'sampleid',
        name: 'sample facility',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'Active',
      },
    ]),

    update: jest.fn().mockImplementation(async () => ({
      id: 'sampleid',
      name: 'sample facility edit',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Active',
    })),

    delete: jest.fn().mockImplementation(async () => ({
      id: 'sampleid',
      name: 'sample facility edit',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Active',
    })),
  },

  locationCoordinates: {
    create: jest.fn().mockImplementation(async () => ({
      id: 'sampleid',
      lat: -1.226956,
      lng: 36.885225,
      facilityId: 'samplefacilityid',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),

    findMany: jest.fn().mockImplementation(async () => [
      {
        id: 'sampleid',
        lat: -1.226956,
        lng: 36.885225,
        facilityId: 'samplefacilityid',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  },
};

describe('FacilitiesService', () => {
  let service: FacilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacilitiesService, PrismaService, EventEmitter2],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

    service = module.get<FacilitiesService>(FacilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a facility', async () => {
    const facilityData: CreateFacilityDto = {
      name: 'sample facility',
    };

    const newFacility = await service.create(facilityData);

    expect(newFacility.data.id).toEqual('sampleid');

    expect(prismaService.facility.create).toHaveBeenCalledWith({
      data: {
        ...facilityData,
      },
    });
  });

  it('should find all facilities', async () => {
    const allFacilities = await service.findAllFacilities();

    expect(allFacilities.length).toEqual(1);

    expect(prismaService.facility.findMany).toHaveBeenCalled();
  });

  it('should update a facility', async () => {
    const updateData: UpdateFacilityDto = {
      id: 'sampleid',
      name: 'sample facility edit',
    };

    const update = await service.updateFacility(updateData);

    expect(prismaService.facility.update).toHaveBeenCalledWith({
      where: {
        id: updateData.id,
      },

      data: {
        ...updateData,
      },
    });

    expect(update.name).toEqual('sample facility edit');
  });

  it('should delete a facility', async () => {
    const deleteDto: DeleteFacilityDto = {
      id: 'sampleid',
    };

    const deleteFacility = await service.deleteFacility(deleteDto.id);

    expect(prismaService.facility.delete).toHaveBeenCalledWith({
      where: {
        id: deleteDto.id,
      },
    });

    expect(deleteFacility.message).toEqual(
      'sample facility edit deleted successfully',
    );
  });

  it('should find a facility', async () => {
    const facilityId: GetFacilityByIdDto = {
      id: 'sampleid',
    };

    const facility = await service.getFacilityById(facilityId.id);

    expect(prismaService.facility.findUnique).toBeCalledWith({
      where: {
        id: 'sampleid',
      },
    });

    expect(facility.id).toEqual('sampleid');
  });
});
