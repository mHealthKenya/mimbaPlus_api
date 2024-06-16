import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class MultiApproveDto {

    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @IsNotEmpty()
    @IsDateString()
    endDate: string;


    @IsNotEmpty()
    @IsString()
    facilityId: string;
}

