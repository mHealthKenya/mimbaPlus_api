import { PartialType } from '@nestjs/mapped-types';
import { CreateFacilityDto } from './create-facility.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFacilityDto extends PartialType(CreateFacilityDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
