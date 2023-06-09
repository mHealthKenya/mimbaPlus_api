import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Gender } from '../users.service';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  f_name: string;

  @IsNotEmpty()
  @IsString()
  l_name: string;

  @IsNotEmpty()
  @IsString()
  locationsCoveredId: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^254[0-9]{9}$/, { message: 'Invalid phone number' })
  phone_number: string;
}
