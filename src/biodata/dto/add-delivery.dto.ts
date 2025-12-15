import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddDeliveryDto {

    @IsNotEmpty()
    @IsString()
    id: string

    @IsNotEmpty()
    @IsBoolean()
    delivered: boolean

    @IsNotEmpty()
    @IsString()
    deliveryMethod: string

    @IsOptional()
    @IsString()
    comments?: string

    @IsOptional()
    @IsString()
    undelivered?: string

    @IsOptional()
    @IsString()
    deliveryDate?: string

}