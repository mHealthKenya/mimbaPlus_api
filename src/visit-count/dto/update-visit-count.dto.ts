import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitCountDto } from './create-visit-count.dto';

export class UpdateVisitCountDto extends PartialType(CreateVisitCountDto) {}
