export enum AccountState {
    ACTIVE = 'ACTIVE',
    FROZEN = 'FROZEN',
    BLOCKED = 'BLOCK',
}

export class Account {
  public id!: number;
  public balance: number = 0;
  public state: AccountState = AccountState.ACTIVE;

  constructor(
    public IBAN: string,
    public bank: number,
    public user: number,
  ) {}
}
