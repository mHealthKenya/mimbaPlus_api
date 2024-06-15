import { IsNotEmpty, IsNumberString } from "class-validator";

export class CreateWalletBaseDto {
    @IsNotEmpty()
    @IsNumberString()
    points: string
}