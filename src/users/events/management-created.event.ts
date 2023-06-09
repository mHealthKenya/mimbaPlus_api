export class ManageMentCreatedEvent {
  constructor(public readonly email: string, public readonly message: string) {}
}
