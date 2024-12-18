import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class CreateBiodatumDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsNumberString()
  height?: number;

  @IsOptional()
  @IsNumberString()
  weight?: number;

  @IsNotEmpty()
  @IsNumberString() // Transform string to number
  age: number;

  @IsOptional()
  @IsDateString()
  last_monthly_period?: string;

  @IsOptional()
  @IsDateString()
  expected_delivery_date?: string;

  @IsOptional()
  @IsNumberString()
  @Matches(/^(?:[0-9]|[1-4][0-9]|50)$/, { message: 'Invalid pregnancy input' })
  pregnancy_period?: number;

  @IsNotEmpty()
  @IsDateString()
  last_clinic_visit: string;

  @IsNotEmpty()
  @IsString()
  facilityId: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  gravidity?: number;

  @IsOptional()
  @IsString()
  parity?: string;
}
