export class TokenTransferRequestEvent {
  constructor(public readonly userId: string, public readonly phone: string, public readonly otp: string) {}
}