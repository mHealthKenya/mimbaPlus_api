export class LocationUpdatedEvent {
  constructor(
    public readonly locationsCoveredId: string,
    public readonly location_name: string,
  ) {}
}
