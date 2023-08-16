import { PartialType } from '@nestjs/mapped-types';
import { CreateClinicvisitDto } from './create-clinicvisit.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateClinicvisitDto extends PartialType(CreateClinicvisitDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
