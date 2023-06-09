import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginManagementDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
