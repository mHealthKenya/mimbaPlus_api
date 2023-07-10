import { Test, TestingModule } from '@nestjs/testing';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesService } from './facilities.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserHelper } from '../helpers/user-helper';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { DeleteFacilityDto } from './dto/delete-facility.dto';
import { GetFacilityByIdDto } from './dto/get-facility.dto';

const facilitiesService = {
  create: jest.fn().mockImplementation(async () => ({
    message: 'Facility created',
    data: {
      id: 'sampleid',
      name: 'sample facility',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Active',
    },
  })),

  findAllFacilities: jest.fn().mockImplementation(async () => [
    {
      id: 'sampleid',
      name: 'sample facility',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Active',
    },
  ]),

  updateFacility: jest.fn().mockImplementation(async () => ({
    id: 'sampleid',
    name: 'sample facility edit',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'Active',
  })),

  deleteFacility: jest.fn().mockImplementation(async () => ({
    id: 'sampleid',
    name: 'sample facility edit',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'Active',
  })),

  getFacilityById: jest.fn().mockImplementation(async () => ({
    id: 'sampleid',
    name: 'sample facility edit',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'Active',
  })),
};

describe('FacilitiesController', () => {
  let controller: FacilitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacilitiesController],
      providers: [FacilitiesService, PrismaService, EventEmitter2, UserHelper],
    })
      .overrideProvider(FacilitiesService)
      .useValue(facilitiesService)
      .compile();

    controller = module.get<FacilitiesController>(FacilitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a facility', async () => {
    const facilityDto: CreateFacilityDto = {
      name: 'sample facility',
    };

    const newFacility = await controller.create(facilityDto);

    expect(facilitiesService.create).toHaveBeenCalledWith(facilityDto);

    expect(newFacility.message).toEqual('Facility created');
  });

  it('should list all facilities', async () => {
    const allFacilities = await controller.findAllFacilities();
    expect(facilitiesService.findAllFacilities).toHaveBeenCalled();
    expect(allFacilities[0].name).toBe('sample facility');
  });

  it('should update a facility', async () => {
    const updateDto: UpdateFacilityDto = {
      id: 'sampleid',
      name: 'sample facility edit',
    };

    const update = await controller.updateFacility(updateDto);

    expect(facilitiesService.updateFacility).toHaveBeenCalledWith(updateDto);
    expect(update.name).toEqual('sample facility edit');
  });

  it('should delete a facility', async () => {
    const deleteUser: DeleteFacilityDto = {
      id: 'sampleid',
    };

    await controller.deleteFacility(deleteUser);

    expect(facilitiesService.deleteFacility).toHaveBeenCalledWith(
      deleteUser.id,
    );
  });

  it('should find a facility by id', async () => {
    const facilityDto: GetFacilityByIdDto = {
      id: 'sampleid',
    };

    const facility = await controller.getFacilityById(facilityDto);

    expect(facilitiesService.getFacilityById).toHaveBeenCalledWith(
      facilityDto.id,
    );

    expect(facility.id).toEqual('sampleid');
  });
});
