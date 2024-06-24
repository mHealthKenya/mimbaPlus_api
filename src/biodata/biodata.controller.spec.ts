import { Test, TestingModule } from '@nestjs/testing';
import { BiodataController } from './biodata.controller';
import { BiodataService } from './biodata.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user-helper';
import { CreateBiodatumDto } from './dto/create-biodatum.dto';
import { GetByMotherIdDto } from './dto/get-by-mother-id.dto';
import { UpdateBiodatumDto } from './dto/update-biodatum.dto';

const createBioData: CreateBiodatumDto = {
  userId: 'sampleUserId',
  facilityId: 'sampleFacilityId',
  height: 150,
  weight: 70,
  last_clinic_visit: '2023-04-12',
  last_monthly_period: '2023-01-12',
  pregnancy_period: 4,
  age: 25,
  expected_delivery_date: '2023-10-12',
};

const bioDataService = {
  create: jest.fn().mockImplementation(async () => ({
    id: 'sampleId',
    userId: 'sampleUserId',
    height: 150,
    weight: 70,
    active: true,
    age: 25,
    last_monthly_period: '2023-01-12T00:00:00.000Z',
    expected_delivery_date: '2023-10-12T00:00:00.000Z',
    pregnancy_period: 4,
    last_clinic_visit: '2023-04-12T00:00:00.000Z',
    facilityId: 'sampleFacilityId',
    previous_pregnancies: 0,
    createdById: 'sampleFacilityAdminId',
    updatedById: 'sampleFacilityAdminId',
    createdAt: new Date(),
    updatedAt: new Date(),
  })),

  getByMotherId: jest.fn().mockImplementation(async () => ({
    id: 'sampleId',
    userId: 'sampleUserId',
    height: 150,
    weight: 70,
    active: true,
    age: 25,
    last_monthly_period: '2023-01-12T00:00:00.000Z',
    expected_delivery_date: '2023-10-12T00:00:00.000Z',
    pregnancy_period: 4,
    last_clinic_visit: '2023-04-12T00:00:00.000Z',
    facilityId: 'sampleFacilityId',
    previous_pregnancies: 0,
    createdById: 'sampleFacilityAdminId',
    updatedById: 'sampleFacilityAdminId',
    createdAt: new Date(),
    updatedAt: new Date(),
  })),

  updateBiodatum: jest.fn().mockImplementation(async () => ({
    id: 'sampleId',
    userId: 'sampleUserId',
    height: 150,
    weight: 70,
    active: true,
    age: 25,
    last_monthly_period: '2023-01-12T00:00:00.000Z',
    expected_delivery_date: '2023-10-12T00:00:00.000Z',
    pregnancy_period: 4,
    last_clinic_visit: '2023-04-12T00:00:00.000Z',
    facilityId: 'sampleFacilityId',
    previous_pregnancies: 0,
    createdById: 'sampleFacilityAdminId',
    updatedById: 'sampleFacilityAdminId',
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
};

describe('BiodataController', () => {
  let controller: BiodataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiodataController],
      providers: [BiodataService, PrismaService, UserHelper],
    })
      .overrideProvider(BiodataService)
      .useValue(bioDataService)
      .compile();

    controller = module.get<BiodataController>(BiodataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a biodata', async () => {
    const newBioData = await controller.create(createBioData);

    expect(bioDataService.create).toHaveBeenCalledWith(createBioData);

    expect(newBioData.id).toEqual('sampleId');
  });

  it('should find a user by id', async () => {
    const data: GetByMotherIdDto = {
      motherId: 'sampleUserId',
    };
    expect(bioDataService.getByMotherId).toHaveBeenCalledWith(data.motherId);
  });

  it('should update biodata', async () => {
    const updateDto: UpdateBiodatumDto = {
      userId: 'sampleUserId',
      height: 100,
    };

    const newUpdate = await controller.updateBiodatum(updateDto);

    expect(bioDataService.updateBiodatum).toHaveBeenCalled();

    expect(newUpdate.id).toEqual('sampleId');
  });
});
