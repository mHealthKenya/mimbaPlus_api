export class LocationCreatedEvent {
  constructor(
    public readonly location_name: string,
    public readonly id: string,
  ) {}
}
