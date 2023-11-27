import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LoginManagementDto {
  @IsNotEmpty()
  @ValidateIf((object) => object.email.length > 0)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ValidateIf((object) => object.password.length > 0)
  @IsString()
  password: string;
}
