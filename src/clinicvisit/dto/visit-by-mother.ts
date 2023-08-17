import { IsNotEmpty, IsString } from 'class-validator';

export class VisitsByMotherDto {
  @IsNotEmpty()
  @IsString()
  motherId: string;
}
