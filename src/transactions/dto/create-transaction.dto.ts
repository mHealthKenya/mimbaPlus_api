import { IsEnum, IsNotEmpty, IsString } from "class-validator";

enum TransactionType {
  DEPOSIT,
  PAYMENT,
  REVERSAL,
  CHECKOUT
}

export class CreateTransactionDto {

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  facilityId: string;

  @IsNotEmpty()
  @IsString()
  amount: string;

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
