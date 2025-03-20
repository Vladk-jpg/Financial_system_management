export class createEnterpriseDTO {
  constructor(
    public name: string,
    public type: string,
    public unp: string,
    public bic: string,
    public address: string,
    public isBank: boolean,
  ) {}
}
