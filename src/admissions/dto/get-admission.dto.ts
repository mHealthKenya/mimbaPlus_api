import { IsNotEmpty, IsString } from "class-validator";

export class GetAdmissionDto {
    @IsNotEmpty()
    @IsString()
    id: string;
}