import { ParticipantType } from './transaction';

export enum LoanSatus {
  ACTIVE = 'ACTIVE',
  PAID_OFF = 'PAID_OFF',
  CANCELED = 'CANCELED',
  PENDING = 'PENDING',
}

export class Loan {
  public id!: number;
  constructor(
    public amount: number,
    public bankId: number,
    public status: LoanSatus,
    public accountIBAN: string,
    public accountType: ParticipantType,
    public interestRate: number,
    public termMonths: number,
    public remainingBalance: number,
    public issueDate: Date,
  ) {}
}
