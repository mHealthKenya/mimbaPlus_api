import { IsNotEmpty, IsString } from 'class-validator';

export class LatestVisitDto {
  @IsNotEmpty()
  @IsString()
  motherId: string;
}
