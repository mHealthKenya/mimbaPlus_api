import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserById {
  @IsNotEmpty()
  @IsString()
  id: string;
}
