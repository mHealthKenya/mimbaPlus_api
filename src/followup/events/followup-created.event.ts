export interface CreateFollowUp {
  chvPhone: string;
  chvName: string;
  motherName: string;
  motherPhone: string;
  facilityName: string;
}
export class CreateFollowUpEvent {
  constructor(public readonly data: CreateFollowUp) {}
}
