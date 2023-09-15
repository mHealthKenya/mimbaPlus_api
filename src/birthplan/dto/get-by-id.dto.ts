import { IsNotEmpty, IsString } from 'class-validator';

export class GetByMotherDto {
  @IsNotEmpty()
  @IsString()
  motherId: string;
}
