import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
export class CreateTransactionDto {
    @IsNotEmpty()
    @IsString()
    code: string

    @IsNotEmpty()
    @IsNumberString()
    points: string


    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsString()
    clinicVisitId: string

}