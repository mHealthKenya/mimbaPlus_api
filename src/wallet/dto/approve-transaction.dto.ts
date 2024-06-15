import { IsNotEmpty, IsString } from 'class-validator';
export class ApproveTransactionDto {
    @IsNotEmpty()
    @IsString()
    id: string;
}