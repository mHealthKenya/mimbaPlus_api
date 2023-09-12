import { PartialType } from '@nestjs/mapped-types';
import { CreateBirthplanDto } from './create-birthplan.dto';

export class UpdateBirthplanDto extends PartialType(CreateBirthplanDto) {}
