export class CreateBankDTO {
  constructor(
    public name: string,
    public bic: string,
    public address: string,
  ) {}
}
