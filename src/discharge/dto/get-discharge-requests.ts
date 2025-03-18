import { DischargeRequestStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class GetDischargeRequestsDto {
    @IsNotEmpty()
    @IsEnum(DischargeRequestStatus, { message: 'status must be either Approved, Rejected or Pending' })
    status: DischargeRequestStatus;
}