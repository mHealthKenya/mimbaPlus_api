import { IsNotEmpty, IsString } from "class-validator";

export class ReverseWalletDto {
    @IsNotEmpty()
    @IsString()
    id: string

    @IsNotEmpty()
    @IsString()
    reason: string
}