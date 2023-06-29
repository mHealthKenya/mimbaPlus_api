import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Gender, Roles } from '../users.service';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  f_name: string;

  @IsNotEmpty()
  @IsString()
  l_name: string;

  @IsNotEmpty()
  @IsEnum(Gender, {
    message:
      'Invalid gender. Valid genders are ' + Gender.FEMALE + ', ' + Gender.MALE,
  })
  gender: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^254[0-9]{9}$/, { message: 'Invalid phone number' })
  phone_number: string;

  @ValidateIf((object) => object.role !== Roles.MOTHER)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ValidateIf((object) => object.role !== Roles.ADMIN)
  @IsNotEmpty({
    message: 'Facility should not be empty',
  })
  @IsString()
  facilityId: string;

  @ValidateIf((object) => object.role !== Roles.MOTHER)
  @IsNotEmpty()
  @IsString()
  national_id: string;

  @IsEnum(Roles, {
    message:
      'Invalid role. Valid roles are ' +
      Roles.ADMIN +
      ', ' +
      Roles.CHV +
      ', ' +
      Roles.FACILITY +
      ', ' +
      Roles.MOTHER,
  })
  @IsNotEmpty()
  @IsString()
  role: string;
}
