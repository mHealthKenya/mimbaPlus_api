import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateVisitCountDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsInt()
    @IsNotEmpty()
    count:number;
}
