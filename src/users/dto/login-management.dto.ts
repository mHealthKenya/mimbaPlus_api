import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LoginManagementDto {
  @IsNotEmpty()
  @ValidateIf((object) => object.email !== undefined)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ValidateIf((object) => object.password !== undefined)
  @IsString()
  password: string;
}
