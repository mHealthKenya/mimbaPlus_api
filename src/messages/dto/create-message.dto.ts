import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMessageDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsString()
    @IsNotEmpty()
    body: string;
}
