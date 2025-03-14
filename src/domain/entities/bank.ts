export class Bank {
  public id!: number;

  constructor(
    public name: string,
    public bic: string,
    public address: string,
  ) {}
}
