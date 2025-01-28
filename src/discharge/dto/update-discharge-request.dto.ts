import { PartialType } from '@nestjs/mapped-types';
import { CreateDischargeDto } from './create-discharge.dto';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateIf } from 'class-validator';

export enum AdmissionStatus {
    PROCESSING = 'Processing',
    DISCHARGED = 'Discharged',
    ADMITTED = 'Admitted'
}

export enum DischargeStatus {
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
    PENDING = 'Pending'
}

export class UpdateDischargeRequestDto extends PartialType(CreateDischargeDto) {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsEnum(DischargeStatus, { message: 'status must be either Approved or Rejected' })
    status: DischargeStatus;

    @ValidateIf((o) => o.status === DischargeStatus.APPROVED)
    @IsNotEmpty()
    @IsNumber({}, { message: 'walletAmount must be a number' })
    @Min(0, { message: 'walletAmount must be 0 or greater' })
    walletAmount: number;

    @ValidateIf((o) => o.status === DischargeStatus.APPROVED)
    @IsNotEmpty()
    @IsNumber({}, { message: 'settleAmount must be a number' })
    @Min(0, { message: 'settleAmount must be 0 or greater' })
    settleAmount: number;
}
