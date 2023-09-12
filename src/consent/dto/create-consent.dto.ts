import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConsentDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
