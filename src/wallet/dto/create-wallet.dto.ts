import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer'; // Import Type decorator for nested validation
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';

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
