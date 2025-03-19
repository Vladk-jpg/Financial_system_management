export class CreateTransactionDTO {
  constructor(
    public senderIBAN: string,
    public recipientIBAN: string,
    public amount: number,
  ) {}
}
