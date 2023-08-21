import { IsNotEmpty, IsString } from 'class-validator';

export class FindByFacilityDto {
  @IsString()
  @IsNotEmpty()
  facilityId: string;
}
