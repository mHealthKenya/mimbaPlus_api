import { IsNotEmpty, IsString } from 'class-validator';

export class GetByIdDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
