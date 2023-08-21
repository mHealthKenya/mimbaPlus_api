import { IsNotEmpty, IsString } from 'class-validator';

export class VisitsByBioDataDto {
  @IsNotEmpty()
  @IsString()
  bioDataId: string;
}
