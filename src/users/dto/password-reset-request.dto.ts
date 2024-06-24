import { IsNotEmpty, Matches } from 'class-validator';
import { combinedRegex } from '../../helpers/regex';


export class PasswordResetRequestDto {
  @IsNotEmpty()
  @Matches(combinedRegex, { message: "Invalid email or phone number" })
  email: string;
}
