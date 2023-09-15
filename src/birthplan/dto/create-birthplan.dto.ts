import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBirthplanDto {
  @IsNotEmpty()
  @IsString()
  motherId: string;

  @IsNotEmpty()
  @IsString()
  facilityId: string;

  @IsOptional()
  @IsString()
  alternative_facility_id?: string;

  @IsNotEmpty()
  @IsString()
  delivery_mode: string;

  @IsOptional()
  @IsString()
  support_person_name?: string;

  @IsOptional()
  @IsString()
  support_person_phone?: string;

  @IsNotEmpty()
  @IsString()
  preferred_transport: string;

  @IsOptional()
  @IsString()
  preferred_attendant_name?: string;

  @IsOptional()
  @IsString()
  preferred_attendant_phone?: string;

  @IsOptional()
  @IsString()
  blood_donor_name?: string;

  @IsOptional()
  @IsString()
  blood_donor_phone?: string;

  @IsOptional()
  @IsString()
  emergency_decision_maker_phone?: string;

  @IsOptional()
  @IsString()
  emergency_decision_maker_name?: string;

  @IsNotEmpty()
  @IsBoolean()
  delivery_bag: boolean;

  @IsOptional()
  @IsString()
  emergency_cs_plan?: string;

  @IsOptional()
  @IsString()
  savings_plan?: string;
}
