import { IsNotEmpty, IsString, Matches, ValidateIf } from 'class-validator';
import { combinedRegex } from '../../helpers/regex';

export class LoginManagementDto {
  @IsNotEmpty()
  @ValidateIf((object) => object.email !== undefined)
  @Matches(combinedRegex, { message: "Invalid email or phone number" })
  email: string;

  @IsNotEmpty()
  @ValidateIf((object) => object.password !== undefined)
  @IsString()
  password: string;
}
