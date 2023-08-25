import { PartialType } from '@nestjs/mapped-types';
import { CreateKnowledgematerialDto } from './create-knowledgematerial.dto';

export class UpdateKnowledgematerialDto extends PartialType(CreateKnowledgematerialDto) {}
