import { Test, TestingModule } from '@nestjs/testing';
import { BirthplanController } from './birthplan.controller';
import { BirthplanService } from './birthplan.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user-helper';
import { CreateBirthplanDto } from './dto/create-birthplan.dto';
import { FindByFacilityDto } from './dto/find-by-facility.dto';
import { GetByMotherDto } from './dto/get-by-id.dto';
import { UpdateBirthplanDto } from './dto/update-birthplan.dto';

const birthPlanService = {
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

  findByFacility: jest.fn().mockImplementation(async () => [
    {
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
    },
  ]),

  getByMotherId: jest.fn().mockImplementation(async () => ({
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
    mother: {
      f_name: 'sample',
      l_name: 'sample',
    },
  })),

  updateBirthPlan: jest.fn().mockImplementation(async () => ({
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
};

describe('BirthplanController', () => {
  let controller: BirthplanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BirthplanController],
      providers: [BirthplanService, PrismaService, UserHelper],
    })
      .overrideProvider(BirthplanService)
      .useValue(birthPlanService)
      .compile();

    controller = module.get<BirthplanController>(BirthplanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    const newBirthPlan = await controller.create(form);

    expect(birthPlanService.create).toHaveBeenCalledWith(form);

    expect(newBirthPlan.id).toEqual('sampleId');
  });

  it('should find birth plans by facility', async () => {
    const form: FindByFacilityDto = {
      facilityId: 'sampleId',
    };

    const birthPlans = await controller.findByFacility(form);

    expect(birthPlans[0].id).toEqual('sampleId');

    expect(birthPlanService.findByFacility).toHaveBeenCalledWith(
      form.facilityId,
    );
  });

  it('should get a birthplan by mother Id', async () => {
    const form: GetByMotherDto = {
      motherId: 'sampleId',
    };

    const birthPlan = await controller.getByFacility(form);

    expect(birthPlan.mother.f_name).toEqual('sample');

    expect(birthPlanService.getByMotherId).toHaveBeenCalledWith(form.motherId);
  });

  it('should update a birthplan', async () => {
    const form: UpdateBirthplanDto = {
      id: 'sampleId',
      support_person_name: 'Updated Field',
    };

    const updatedBirthPlan = await controller.updateBirthPlan(form);

    expect(updatedBirthPlan.support_person_name).toEqual(
      form.support_person_name,
    );

    expect(birthPlanService.updateBirthPlan).toHaveBeenCalledWith(form);
  });
});
