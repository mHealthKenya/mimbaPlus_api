import { IsNotEmpty, IsString } from 'class-validator';

export class CreateKnowledgematerialDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
