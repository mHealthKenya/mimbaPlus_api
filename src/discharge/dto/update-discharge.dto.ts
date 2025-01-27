import { PartialType } from '@nestjs/mapped-types';
import { CreateDischargeDto } from './create-discharge.dto';

export class UpdateDischargeDto extends PartialType(CreateDischargeDto) {}
