import { AdmissionStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class GetFacilityAdmissionsDto {
    @IsNotEmpty()
    @IsEnum(AdmissionStatus, { message: 'status must be either Admitted, Discharged or Processing' })
    status: AdmissionStatus;
}

