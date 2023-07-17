import { PartialType } from '@nestjs/mapped-types';
import { CreateBiodatumDto } from './create-biodatum.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBiodatumDto extends PartialType(CreateBiodatumDto) {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
