import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFacilityDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
