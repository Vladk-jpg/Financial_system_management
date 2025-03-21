import { AccountState } from "./account";

export class EAccount {
  public id!: number;
  public balance: number = 0;
  public state: AccountState = AccountState.ACTIVE;

  constructor(
    public IBAN: string,
    public bank: number,
    public enterprise: number,
  ) {}
}
