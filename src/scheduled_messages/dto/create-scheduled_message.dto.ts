import { IsArray, IsNotEmpty, IsString, IsISO8601, ArrayNotEmpty, IsDate, IsDateString } from 'class-validator';

export class CreateScheduledMessageDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) // Ensures each phone number is a string
  userId: string[];

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;
}
