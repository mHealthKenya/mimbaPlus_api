import { IsEnum, IsOptional, IsString, IsDateString, ValidateIf, IsNumber } from 'class-validator';
import { MessageCategory } from '@prisma/client';

export class CreateScheduledMessageDto {
  @IsString()
  message: string;

  @IsEnum(MessageCategory)
  category: MessageCategory;

  @ValidateIf(o => o.category === MessageCategory.GENERAL)
  @IsDateString()
  scheduledAt?: string;

  @ValidateIf(o => o.category === MessageCategory.GESTATION_PERIOD)
  @IsNumber()
  gestationTarget?: number;

  @ValidateIf(o => o.category === MessageCategory.HIGH_RISK)
  @IsString()
  riskCondition?: string;
}