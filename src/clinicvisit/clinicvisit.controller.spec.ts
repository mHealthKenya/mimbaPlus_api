import { Test, TestingModule } from '@nestjs/testing';
import { ClinicvisitController } from './clinicvisit.controller';
import { ClinicvisitService } from './clinicvisit.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user-helper';
import { CreateClinicvisitDto } from './dto/create-clinicvisit.dto';
import { LatestVisitDto } from './dto/latest-visit.dto';
import { GetVisitsByFacilityDto } from './dto/visits-by-facility-id.dto';
import { VisitsByBioDataDto } from './dto/visit-by-bio';
import { UpdateClinicvisitDto } from './dto/update-clinicvisit.dto';

describe('ClinicvisitController', () => {
  const clinicService = {
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

    findAll: jest.fn().mockImplementation(async () => [
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

    findVisitsByFacility: jest.fn().mockImplementation(async () => [
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

    findLatest: jest.fn().mockImplementation(async () => ({
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
    })),

    findVisitsByBioData: jest.fn().mockImplementation(async () => [
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
  };
  let controller: ClinicvisitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicvisitController],
      providers: [ClinicvisitService, PrismaService, UserHelper],
    })
      .overrideProvider(ClinicvisitService)
      .useValue(clinicService)
      .compile();

    controller = module.get<ClinicvisitController>(ClinicvisitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a clinic visit', async () => {
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

    const visit = await controller.create(visitDto);

    expect(clinicService.create).toHaveBeenCalledWith(visitDto);

    expect(visit.id).toEqual('sampleId');
  });

  it('should find all visits', async () => {
    const visits = await controller.findAll();

    expect(visits.length).toEqual(1);

    expect(clinicService.findAll).toHaveBeenCalled();

    expect(visits[0].id).toEqual('sampleId');
  });

  it('should find the latest visit', async () => {
    const dto: LatestVisitDto = {
      bioDataId: 'sampleId',
    };

    const visit = await controller.findLatestVisit(dto);

    expect(clinicService.findLatest).toHaveBeenCalledWith('sampleId');
    expect(visit['id']).toEqual('sampleId');
  });

  it('should find all visits by facility', async () => {
    const dto: GetVisitsByFacilityDto = {
      facilityId: 'sampleId',
    };

    const visits = await controller.findByFacility(dto);

    expect(visits.length).toEqual(1);

    expect(clinicService.findVisitsByFacility).toHaveBeenCalledWith('sampleId');

    expect(visits[0].id).toEqual('sampleId');
  });

  it('should find all visits by biodata', async () => {
    const dto: VisitsByBioDataDto = {
      bioDataId: 'sampleId',
    };

    const visits = await controller.findByBioData(dto);

    expect(visits.length).toEqual(1);

    expect(clinicService.findVisitsByBioData).toHaveBeenCalledWith('sampleId');
  });

  it('should update a visit', async () => {
    const dto: UpdateClinicvisitDto = {
      id: 'sampleId',
      weight: '200',
    };

    const updated = await controller.update(dto);

    expect(updated.weight).toEqual('200');

    expect(clinicService.update).toHaveBeenCalledWith(dto);
  });
});
