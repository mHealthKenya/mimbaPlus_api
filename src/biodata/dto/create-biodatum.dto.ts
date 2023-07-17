import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateBiodatumDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsNumberString()
  height: number;

  @IsNotEmpty()
  @IsNumberString()
  weight: number;

  @IsNotEmpty()
  @IsNumberString() // Transform string to number
  age: number;

  @IsNotEmpty()
  @IsDateString()
  last_monthly_period: string;

  @IsNotEmpty()
  @IsDateString()
  expected_delivery_date: string;

  @IsNotEmpty()
  @IsNumberString()
  @Matches(/^(?:[0-9]|[1-4][0-9]|50)$/, { message: 'Invalid pregnancy input' })
  pregnancy_period: number;

  @IsNotEmpty()
  @IsDateString()
  last_clinic_visit: string;

  @IsNotEmpty()
  @IsString()
  facilityId: string;

  @IsOptional()
  @IsNumberString()
  previous_pregnancies?: number;
}
