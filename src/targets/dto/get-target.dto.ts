import { IsNotEmpty, IsString } from 'class-validator';

export class GetTargetDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
