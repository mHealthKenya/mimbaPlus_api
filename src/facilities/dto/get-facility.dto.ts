import { IsNotEmpty, IsString } from 'class-validator';

export class GetFacilityByIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
