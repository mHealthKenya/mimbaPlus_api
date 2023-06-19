import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserByRole {
  @IsNotEmpty()
  @IsString()
  role: string;
}
