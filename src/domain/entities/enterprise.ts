export class Enterprise {
  public id!: number;
  constructor(
    public name: string,
    public type: string,
    public unp: string,
    public bic: string,
    public address: string,
  ) {}
}
