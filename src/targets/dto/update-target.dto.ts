import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UpdateTargetDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsNumberString()
  setTarget: string;
}
