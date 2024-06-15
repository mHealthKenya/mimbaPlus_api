export class TransactionCompletedEvent {
    constructor(public readonly userId: string, public readonly points: number, public readonly balance: number) { }
}