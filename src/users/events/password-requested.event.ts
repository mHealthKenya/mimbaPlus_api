export class PasswordResetRequestEvent {
  constructor(public readonly email: string, public readonly code: string) {}
}
