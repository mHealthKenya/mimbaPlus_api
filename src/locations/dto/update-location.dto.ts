import { IsNotEmpty, IsString } from 'class-validator';
import { CreateLocationDto } from './create-location.dto';

export class UpdateLocationDto extends CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
