import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Roles } from '../users.service';

export class GetUserByRole {
  @IsNotEmpty()
  @IsEnum(Roles)
  @IsString()
  role: string;
}
