export class UserCreatedEvent {
  constructor(public readonly email: string, public readonly message: string) {}
}
