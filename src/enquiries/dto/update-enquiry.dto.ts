import { PartialType } from '@nestjs/mapped-types';
import { CreateEnquiryDto } from './create-enquiry.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEnquiryDto extends PartialType(CreateEnquiryDto) {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  replyTitle: string;

  @IsNotEmpty()
  @IsString()
  replyDescription: string;
}
