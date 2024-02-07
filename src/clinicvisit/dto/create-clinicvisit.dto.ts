import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumberString,
  IsDateString,
} from 'class-validator';

export class CreateClinicvisitDto {
  @IsNotEmpty()
  @IsString()
  bioDataId: string;

  @IsNotEmpty()
  @IsString()
  facilityId: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsNumberString()
  weight: string;

  @IsNotEmpty()
  @IsString()
  hiv: string;

  @IsNotEmpty()
  @IsNumberString()
  hbLevel: string;

  @IsNotEmpty()
  @IsString()
  rhesusFactor: string;

  @IsNotEmpty()
  @IsString()
  urinalysis: string;

  @IsNotEmpty()
  @IsString()
  vdrl: string;

  @IsNotEmpty()
  @IsString()
  bloodRBS: string;

  @IsOptional()
  @IsString()
  TB?: string;

  @IsNotEmpty()
  @IsString()
  bloodGroup: string;

  @IsNotEmpty()
  @IsString()
  hepatitisB: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  treatment?: string;

  @IsOptional()
  @IsDateString()
  hivTestDate?: string;

  @IsOptional()
  @IsString()
  tetanus?: string;

  @IsOptional()
  @IsDateString()
  tetanusInjectionDate?: string;
}
