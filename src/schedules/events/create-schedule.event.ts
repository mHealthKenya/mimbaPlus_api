export interface EventCreated {
  motherId: string;
  facilityId: string;
  title: string;
  description: string;
  date: Date;
}

export class ScheduleCreatedEvent {
  constructor(public readonly data: EventCreated) {}
}
