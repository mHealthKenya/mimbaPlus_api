import { IsNotEmpty, IsString } from "class-validator";

export class GetDischargeRequestDto {
    @IsNotEmpty()
    @IsString()
    id: string;
}