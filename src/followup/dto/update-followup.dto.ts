import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFollowupDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
