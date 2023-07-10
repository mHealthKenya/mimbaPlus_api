import { IsNotEmpty, IsString } from 'class-validator';
import { GetUserByRole } from './get-user-by-role.dto';

export class GetUserByRoleAndFacility extends GetUserByRole {
  @IsNotEmpty()
  @IsString()
  facilityId: string;
}
