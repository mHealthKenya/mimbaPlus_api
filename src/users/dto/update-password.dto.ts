import { IsNotEmpty, IsString } from 'class-validator';
import { PasswordResetRequestDto } from './password-reset-request.dto';

export class UpdatePasswordDto extends PasswordResetRequestDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
