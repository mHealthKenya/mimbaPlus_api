import { IsNotEmpty, IsString } from 'class-validator';

export class FindByMotherIdDto {
  @IsNotEmpty()
  @IsString()
  motherId: string;
}
