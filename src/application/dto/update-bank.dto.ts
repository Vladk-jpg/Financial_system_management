export class UpdateBankDTO {
  constructor(
    public name: string,
    public bic: string,
    public address: string
  ) {}
}
