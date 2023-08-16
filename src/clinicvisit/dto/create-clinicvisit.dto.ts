import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumberString,
} from 'class-validator';

export class CreateClinicvisitDto {
  @IsNotEmpty()
  @IsString()
  motherId: string;

  @IsNotEmpty()
  @IsString()
  facilityId: string;

  @IsNotEmpty()
  @IsNumberString()
  weight: number;

  @IsNotEmpty()
  @IsString()
  hiv: string;

  @IsNotEmpty()
  @IsNumberString()
  hbLevel: number;

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
  syphilis: string;

  @IsNotEmpty()
  @IsString()
  hepatitisB: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
