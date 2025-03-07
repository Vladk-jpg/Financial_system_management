export class Bank {
  public id!: number;

  constructor(
    public name: string,
    public bic: string,
    public address: string,
  ) {
    if (!name) throw new Error('Bank name is required');
    if (!bic) throw new Error('Bank BIC is required');
    if (!address) throw new Error('Address is required');
  }
}
