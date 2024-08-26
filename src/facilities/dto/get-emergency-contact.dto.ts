import { IsNotEmpty, IsString } from "class-validator";

export class GetEmergencyContactDto {
    @IsNotEmpty()
    @IsString()
    facilityId: string
}