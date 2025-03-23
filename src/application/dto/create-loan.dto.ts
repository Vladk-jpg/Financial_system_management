export class CreateLoanDTO {
  constructor(
    public amount: number,
    public accountIBAN: string,
    public interestRate: number,
    public termMonths: number,
  ) {}
}
