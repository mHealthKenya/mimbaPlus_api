import { IsArray, IsNotEmpty, IsString, IsISO8601, ArrayNotEmpty, IsDate } from 'class-validator';

export class CreateScheduledMessageDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) // Ensures each phone number is a string
  phoneNumbers: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) // Ensures each phone number is a string
  userId: string[];

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDate()
  @IsNotEmpty()
  scheduledAt: string;
}
