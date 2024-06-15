
import { IsNotEmpty, IsString } from "class-validator";

export class FindWalletDto {
    @IsNotEmpty()
    @IsString()
    id: string
}
