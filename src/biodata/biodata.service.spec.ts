import { Test, TestingModule } from '@nestjs/testing';
import { BiodataService } from './biodata.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user-helper';
import { CreateBiodatumDto } from './dto/create-biodatum.dto';
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

const prisma = {
  bioData: {
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

    findUnique: jest.fn().mockImplementation(async () => ({
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

    update: jest.fn().mockImplementation(async () => ({
      id: 'sampleId',
      userId: 'sampleUserId',
      height: 100,
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
  },
};

const userHelper = {
  getUser() {
    return 'sampleFacilityAdminId';
  },
};

describe('BiodataService', () => {
  let service: BiodataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BiodataService, PrismaService, UserHelper],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .overrideProvider(UserHelper)
      .useValue(userHelper)
      .compile();

    service = module.get<BiodataService>(BiodataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a biodata', async () => {
    const newBioData = await service.create(createBioData);

    expect(prisma.bioData.create).toHaveBeenCalled();

    expect(newBioData.id).toEqual('sampleId');
  });

  it('should find a mother biodata', async () => {
    const motherId = 'sampleUserId';
    expect(prisma.bioData.findUnique).toHaveBeenCalledWith({
      where: {
        userId: motherId,
      },
      include: {
        user: {
          select: {
            f_name: true,
            l_name: true,
            national_id: true,
            phone_number: true,
          },
        },
      },
    });
  });

  it('should update biodata', async () => {
    const updateDto: UpdateBiodatumDto = {
      userId: 'sampleUserId',
      height: 100,
    };

    const newUpdate = await service.updateBiodatum(updateDto);

    expect(prisma.bioData.update).toHaveBeenCalled();

    expect(newUpdate.id).toEqual('sampleId');
  });
});
