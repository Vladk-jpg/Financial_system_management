import { ParticipantType } from 'src/domain/entities/transaction';

export class CreateTransactionDTO {
  constructor(
    public senderIBAN: string,
    public senderType: ParticipantType,
    public recipientIBAN: string,
    public recipientType: ParticipantType,
    public amount: number,
  ) {}
}
