import { PartialType } from '@nestjs/mapped-types';
import { CreateManagementDto } from './create-management.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateManagementDto extends PartialType(CreateManagementDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
