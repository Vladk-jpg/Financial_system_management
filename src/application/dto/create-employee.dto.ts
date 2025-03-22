export class CreateEmployeeDTO {
  constructor(
    public IBAN: string,
    public salary: number,
    public position: string,
  ) {}
}
