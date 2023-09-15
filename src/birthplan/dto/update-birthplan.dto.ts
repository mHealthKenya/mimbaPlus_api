import { PartialType } from '@nestjs/mapped-types';
import { CreateBirthplanDto } from './create-birthplan.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBirthplanDto extends PartialType(CreateBirthplanDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
