import { IsNotEmpty, IsString } from 'class-validator';

export class FindByFacilityDto {
  @IsNotEmpty()
  @IsString()
  facilityId: string;
}
