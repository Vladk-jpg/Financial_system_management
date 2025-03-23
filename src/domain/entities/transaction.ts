import { OperationState } from '../enums/operation-state.enum';

export enum ParticipantType {
  ACCOUNT = 'ACCOUNT',
  ENTERPRISE = 'ENTERPRISE',
  LOAN = 'LOAN',
}

export class Transaction {
  public id!: number;
  public state: OperationState = OperationState.COMPLITED;
  public createdAt!: Date;
  constructor(
    public senderType: ParticipantType,
    public senderId: number,
    public recipientType: ParticipantType,
    public recipientId: number,
    public amount: number,
  ) {}
}
