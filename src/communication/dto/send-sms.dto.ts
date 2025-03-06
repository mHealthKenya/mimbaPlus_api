import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class SendSMSDto {
    @IsNotEmpty()
    @IsArray()
    phoneNumbers: string[];

    @IsNotEmpty()
    @IsString()
    message: string;
}