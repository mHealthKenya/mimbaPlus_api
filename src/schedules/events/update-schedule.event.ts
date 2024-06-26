export interface EventUpdated {
  id: string;
  motherId: string;
  facilityId: string;
  title: string;
  description: string;
  date: Date;
  chvId?: string;
}

export class ScheduleUpdatedEvent {
  constructor(public readonly data: EventUpdated) {}
}
