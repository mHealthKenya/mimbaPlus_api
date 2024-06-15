import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletDto } from './create-wallet.dto';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsNumberString()
    balance: string
}
