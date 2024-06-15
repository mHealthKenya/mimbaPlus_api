import { IsNotEmpty, IsString } from "class-validator";

export class RequestCodeDto {
    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsString()
    clinicVisitId: string
}