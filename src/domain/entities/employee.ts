export class Employee {
  public id!: number;
  constructor(
    public IBAN: string,
    public salary: number,
    public position: string,
  ) {}
}
