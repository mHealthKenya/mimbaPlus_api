import { IsNotEmpty, IsString } from "class-validator";

export class GetFacilityAdmissionsDto {
    @IsNotEmpty()
    @IsString()
    facilityId: string;
}