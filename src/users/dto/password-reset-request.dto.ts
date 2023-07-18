import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordResetRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
