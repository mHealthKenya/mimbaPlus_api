

export class CodeRequestedEvent {
    constructor(public readonly phone_number: string, public readonly code: string) { }
}