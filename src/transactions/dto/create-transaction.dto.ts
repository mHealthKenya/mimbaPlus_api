import { TransactionType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateTransactionDto {

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  facilityId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  invoice: string;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  transactionDate: Date;

}

export class TansferRequestDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  facilityId: string;

  @IsNotEmpty()
  @IsString()
  phone: string
}

export class TansferCompleteDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  facilityId: string;

  @IsNotEmpty()
  @IsString()
  otp: string

  @IsNotEmpty()
  @IsNumber()
  amount: number
}

export class TransactionReversalDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  facilityId: string;

  @IsNotEmpty()
  @IsString()
  transactionId: string
}