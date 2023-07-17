import { IsNotEmpty, IsString } from 'class-validator';

export class GetByMotherIdDto {
  @IsString()
  @IsNotEmpty()
  motherId: string;
}
