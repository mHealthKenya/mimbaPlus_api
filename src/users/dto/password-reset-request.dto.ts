import { IsNotEmpty, Matches } from 'class-validator';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^254[0-9]{9}$/

const combinedRegex = new RegExp(emailRegex.source + '|' + phoneRegex.source);

export class PasswordResetRequestDto {
  @IsNotEmpty()
  @Matches(combinedRegex, { message: "Invalid email or phone number" })
  email: string;
}
