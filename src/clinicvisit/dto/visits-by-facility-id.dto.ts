import { IsNotEmpty, IsString } from 'class-validator';

export class GetVisitsByFacilityDto {
  @IsNotEmpty()
  @IsString()
  facilityId: string;
}
