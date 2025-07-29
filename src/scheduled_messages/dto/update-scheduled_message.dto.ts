import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduledMessageDto } from './create-scheduled_message.dto';

export class UpdateScheduledMessageDto extends PartialType(CreateScheduledMessageDto) {}
