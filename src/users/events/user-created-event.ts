export class UserCreatedEvent {
  constructor(
    public readonly email: string,
    public readonly message: string,
    public readonly createdById?: string,
    public readonly role?: string,
  ) {}
}
