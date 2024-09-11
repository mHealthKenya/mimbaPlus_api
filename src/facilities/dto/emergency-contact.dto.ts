import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateEmergencyContactDto {
    @IsNotEmpty()
    @IsString()
    facilityId: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^254[0-9]{9}$/, { message: 'Invalid phone number' })
    phone: string
}