
interface Options {
  email?: string;
  phone?: string
  type: 'email' | 'phone'
}

export class PasswordResetRequestEvent {
  constructor(public readonly options: Options, public readonly code: string) { }
}
