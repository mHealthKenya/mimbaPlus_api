import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Roles } from '../users.service';

export class CreateManagementDto extends CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  national_id: string;

  @IsNotEmpty()
  @IsEnum(Roles)
  role: string;
}
