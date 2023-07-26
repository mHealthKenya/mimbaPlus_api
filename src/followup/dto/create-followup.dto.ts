import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFollowupDto {
  @IsNotEmpty()
  @IsString()
  scheduleId: string;

  @IsNotEmpty()
  @IsString()
  chvId: string;
}
