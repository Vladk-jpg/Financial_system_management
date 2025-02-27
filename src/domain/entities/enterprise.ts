export class Enterprise {
  private readonly id: string;
  private name: string;
  private type: string;
  private unp: string;
  private bic: string;
  private address: string;

  constructor(
    id: string,
    name: string,
    type: string,
    unp: string,
    bic: string,
    address: string,
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.unp = unp;
    this.bic = bic;
    this.address = address;

    this.validate();
  }

  private validate(): void {
    //Write later
  }
}
