import { Test, TestingModule } from '@nestjs/testing';
import { ClinicvisitService } from './clinicvisit.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user-helper';
import { CreateClinicvisitDto } from './dto/create-clinicvisit.dto';
import { UpdateClinicvisitDto } from './dto/update-clinicvisit.dto';

const prismaService = {
  clinicVisit: {
    create: jest.fn().mockImplementation(async () => ({
      id: 'sampleId',
      bioDataId: 'sampleId',
      facilityId: 'sampleId',
      weight: '100',
      hiv: 'negative',
      hbLevel: '100',
      rhesusFactor: 'sample',
      bloodGroup: 'A',
      urinalysis: 'sample',
      vdrl: 'sample',
      bloodRBS: 'sample',
      TB: 'Not tested',
      hepatitisB: 'sample',
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),

    findMany: jest.fn().mockImplementation(async () => [
      {
        id: 'sampleId',
        bioDataId: 'sampleId',
        facilityId: 'sampleId',
        weight: '100',
        hiv: 'positive',
        hbLevel: '100',
        rhesusFactor: 'sample',
        bloodGroup: 'A',
        urinalysis: 'sample',
        vdrl: 'sample',
        bloodRBS: 'sample',
        TB: 'Not tested',
        hepatitisB: 'sample',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        facility: {
          name: 'Neema Uhai Hospital',
        },
        bioData: {
          user: {
            f_name: 'Joel',
            l_name: 'Wekesa',
            phone_number: '254123456785',
          },
          height: 150,
          weight: 70,
          active: true,
          age: 25,
          last_monthly_period: '2023-01-12T00:00:00.000Z',
          expected_delivery_date: '2023-10-12T00:00:00.000Z',
          pregnancy_period: 5,
          last_clinic_visit: '2023-04-12T00:00:00.000Z',
          previous_pregnancies: 0,
        },
      },
    ]),

    update: jest.fn().mockImplementation(async () => ({
      id: 'sampleId',
      bioDataId: 'sampleId',
      facilityId: 'sampleId',
      weight: '200',
      hiv: 'negative',
      hbLevel: '100',
      rhesusFactor: 'sample',
      bloodGroup: 'A',
      urinalysis: 'sample',
      vdrl: 'sample',
      bloodRBS: 'sample',
      TB: 'Not tested',
      hepatitisB: 'sample',
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  },
};

describe('ClinicvisitService', () => {
  let service: ClinicvisitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicvisitService, PrismaService, UserHelper],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

    service = module.get<ClinicvisitService>(ClinicvisitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a visit', async () => {
    const visitDto: CreateClinicvisitDto = {
      bioDataId: 'sampleId',
      facilityId: 'sampleId',
      weight: '100',
      hiv: 'negative',
      hbLevel: '100',
      rhesusFactor: 'sample',
      bloodGroup: 'A',
      urinalysis: 'sample',
      vdrl: 'sample',
      bloodRBS: 'sample',
      TB: 'Not tested',
      hepatitisB: 'sample',
    };

    const newVisit = await service.create(visitDto);

    expect(newVisit.id).toEqual('sampleId');
  });

  it('should find the latest visit', async () => {
    const visit = await service.findLatest('sampleId');

    expect(visit['id']).toEqual('sampleId');
  });

  it('should find all visits', async () => {
    const visits = await service.findAll();

    expect(visits.length).toEqual(1);

    expect(prismaService.clinicVisit.findMany).toHaveBeenCalled();
  });

  it('should find visits by a facility', async () => {
    const visits = await service.findVisitsByFacility('sampleId');
    expect(visits.length).toEqual(1);
    expect(prismaService.clinicVisit.findMany).toHaveBeenCalled();
  });

  it('should find visits by biodata', async () => {
    const visits = await service.findVisitsByBioData('sampleId');
    expect(visits[0]['id']).toBe('sampleId');
    expect(prismaService.clinicVisit.findMany).toHaveBeenCalled();
  });

  it('should update a clinic visit', async () => {
    const dto: UpdateClinicvisitDto = {
      id: 'sampleId',
      weight: '200',
    };

    const update = await service.update(dto);

    expect(update.weight).toEqual(dto.weight);
  });
});
