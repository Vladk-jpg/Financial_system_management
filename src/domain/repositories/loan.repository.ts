import { Loan } from '../entities/loan';

export interface ILoanRepository {
  create(loan: Loan): Promise<Loan>;
  findById(id: number, manager?: any): Promise<Loan | null>;
  findByAccountIBAN(iban: string): Promise<Loan[]>;
  findByBankId(id: number): Promise<Loan[]>;
  update(loan: Loan): Promise<Loan>;
  delete(id: number): Promise<void>;
  repay(id: number, amount: number, manager: any): Promise<Boolean>;
}
