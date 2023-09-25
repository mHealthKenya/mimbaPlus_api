export interface Message {
  cost?: number;
  messageId?: string;
  status: string;
  statusCode: number;
  messagePart?: number;
}

export class MessageEvent {
  constructor(public readonly message: Message) {}
}
