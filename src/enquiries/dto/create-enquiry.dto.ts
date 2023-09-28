import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEnquiryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
