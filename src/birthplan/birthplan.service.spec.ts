import { Test, TestingModule } from '@nestjs/testing';
import { BirthplanService } from './birthplan.service';
import { UserHelper } from '../helpers/user-helper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBirthplanDto } from './dto/create-birthplan.dto';
import { FindByFacilityDto } from './dto/find-by-facility.dto';
import { GetByMotherDto } from './dto/get-by-id.dto';
import { UpdateBirthplanDto } from './dto/update-birthplan.dto';

const prismaService = {
  birthPlan: {
    create: jest.fn().mockImplementation(async () => ({
      id: 'sampleId',
      motherId: 'sampleId',
      facilityId: 'sampleId',
      alternative_facility_id: 'sampleId',
      delivery_mode: 'Natural',
      support_person_name: 'Test Support Person',
      support_person_phone: '2547000000000',
      preferred_transport: 'Ambulance',
      preferred_attendant_name: 'Test Attendant Person',
      preferred_attendant_phone: '2547000000000',
      blood_donor_name: 'Test Donor',
      blood_donor_phone: '2547000000000',
      emergency_decision_maker_phone: '2547000000000',
      emergency_decision_maker_name: 'Test Decision Maker',
      delivery_bag: true,
      emergency_cs_plan: 'Emergency CS PLan',
      savings_plan: 'Savings Plan',
      createdAt: new Date(),
      updatedAr: new Date(),
    })),

    findMany: jest.fn().mockImplementation(async () => [
      {
        id: 'sampleId',
        motherId: 'sampleId',
        facilityId: 'sampleId',
        alternative_facility_id: 'sampleId',
        delivery_mode: 'Natural',
        support_person_name: 'Test Support Person',
        support_person_phone: '254719748142',
        preferred_transport: 'Ambulance',
        preferred_attendant_name: 'Test Attendant Person',
        preferred_attendant_phone: '254719748142',
        blood_donor_name: 'Test Donor',
        blood_donor_phone: '254719748142',
        emergency_decision_maker_phone: '254719748142',
        emergency_decision_maker_name: 'Test Decision Maker',
        delivery_bag: true,
        emergency_cs_plan: 'Emergency CS PLan',
        savings_plan: 'Savings Plan',
        createdAt: '2023-09-12T10:51:36.337Z',
        updatedAr: '2023-09-12T10:51:36.337Z',
      },
    ]),

    findUnique: jest.fn().mockImplementation(async () => ({
      id: 'sampleId',
      motherId: 'sampleId',
      facilityId: 'sampleId',
      alternative_facility_id: 'sampleId',
      delivery_mode: 'Natural',
      support_person_name: 'Test Support Person',
      support_person_phone: '254719748142',
      preferred_transport: 'Ambulance',
      preferred_attendant_name: 'Test Attendant Person',
      preferred_attendant_phone: '254719748142',
      blood_donor_name: 'Test Donor',
      blood_donor_phone: '254719748142',
      emergency_decision_maker_phone: '254719748142',
      emergency_decision_maker_name: 'Test Decision Maker',
      delivery_bag: true,
      emergency_cs_plan: 'Emergency CS PLan',
      savings_plan: 'Savings Plan',
      createdAt: '2023-09-12T10:51:36.337Z',
      updatedAr: '2023-09-12T10:51:36.337Z',
    })),

    update: jest.fn().mockImplementation(async () => ({
      id: 'sampleId',
      motherId: 'sampleId',
      facilityId: 'sampleId',
      alternative_facility_id: 'sampleId',
      delivery_mode: 'Natural',
      support_person_name: 'Updated Field',
      support_person_phone: '254719748142',
      preferred_transport: 'Ambulance',
      preferred_attendant_name: 'Test Attendant Person',
      preferred_attendant_phone: '254719748142',
      blood_donor_name: 'Test Donor',
      blood_donor_phone: '254719748142',
      emergency_decision_maker_phone: '254719748142',
      emergency_decision_maker_name: 'Test Decision Maker',
      delivery_bag: true,
      emergency_cs_plan: 'Emergency CS PLan',
      savings_plan: 'Savings Plan',
      createdAt: '2023-09-12T10:51:36.337Z',
      updatedAr: '2023-09-12T10:51:36.337Z',
    })),
  },
};

describe('BirthplanService', () => {
  let service: BirthplanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BirthplanService, PrismaService, UserHelper],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

    service = module.get<BirthplanService>(BirthplanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a birthplan', async () => {
    const form: CreateBirthplanDto = {
      motherId: 'sampleId',
      facilityId: 'sampleId',
      alternative_facility_id: 'sampleId',
      delivery_mode: 'Natural',
      support_person_name: 'Test Support Person',
      support_person_phone: '2547000000000',
      preferred_transport: 'Ambulance',
      preferred_attendant_name: 'Test Attendant Person',
      preferred_attendant_phone: '2547000000000',
      blood_donor_name: 'Test Donor',
      blood_donor_phone: '2547000000000',
      emergency_decision_maker_phone: '2547000000000',
      emergency_decision_maker_name: 'Test Decision Maker',
      delivery_bag: true,
      emergency_cs_plan: 'Emergency CS PLan',
      savings_plan: 'Savings Plan',
    };

    const newBirthPlan = await service.create(form);

    expect(prismaService.birthPlan.create).toHaveBeenCalledWith({
      data: form,
    });

    expect(newBirthPlan.id).toEqual('sampleId');
  });

  it('should find birth plans by facility id', async () => {
    const form: FindByFacilityDto = {
      facilityId: 'sampleId',
    };

    const birthPlans = await service.findByFacility(form.facilityId);

    expect(prismaService.birthPlan.findMany).toHaveBeenCalledWith({
      where: {
        facilityId: form.facilityId,
      },
    });

    expect(birthPlans[0].id).toEqual('sampleId');
  });

  it('should find a birthplan by motherId', async () => {
    const form: GetByMotherDto = {
      motherId: 'SampleId',
    };

    const birthPlan = await service.getByMotherId(form.motherId);

    expect(birthPlan.id).toEqual('sampleId');

    expect(prismaService.birthPlan.findUnique).toHaveBeenCalledWith({
      where: {
        motherId: form.motherId,
      },

      include: {
        mother: {
          select: {
            f_name: true,
            l_name: true,
          },
        },
      },
    });
  });

  it('should update a birth plan', async () => {
    const form: UpdateBirthplanDto = {
      id: 'sampleId',
      support_person_name: 'Updated Field',
    };

    const updated = await service.updateBirthPlan(form);

    expect(updated.support_person_name).toEqual('Updated Field');

    expect(prismaService.birthPlan.update).toHaveBeenCalledWith({
      where: {
        id: 'sampleId',
      },
      data: { support_person_name: 'Updated Field' },
    });
  });
});
