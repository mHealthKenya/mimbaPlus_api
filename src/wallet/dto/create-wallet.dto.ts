import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer'; // Import Type decorator for nested validation
import { CreateTransactionDto } from '../../transactions/dto/create-transaction.dto';

export class CreateWalletDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  balance: number;

  @IsOptional()
  @ValidateNested({ each: true }) // Validate each item in the array
  @Type(() => CreateTransactionDto) // Specify the type of nested object
  transaction?: CreateTransactionDto[]; // Make transactions optional
}

export class GetByWalletDto {
  @IsNotEmpty()
  @IsString()
  walletId: string;

  @IsOptional()
  @IsString()
  userId: string
}

export class TransferTokenDto {
  @IsString()
  userId: string;

  @IsString()
  facilityId: string;

  @IsNumber()
  amount: number;

  @IsString()
  phone: string;
}