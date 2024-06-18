import { IsDateString, IsNotEmpty } from "class-validator";

export class PeriodTransactionsDto {
    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @IsNotEmpty()
    @IsDateString()
    endDate: string;
}