import { IsNotEmpty, IsString } from "class-validator";

export class CreateAdmissionDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    facilityId: string;
}
