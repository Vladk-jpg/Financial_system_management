import { Loan} from 'src/domain/entities/loan';
import { CreateLoanDTO } from '../dto/create-loan.dto';

export interface ILoanService {
  createLoan(dto: CreateLoanDTO): Promise<Loan | null>;
  activateLoan(id: number): Promise<void>;
  cancelLoan(id: number): Promise<void>;
  getLoanById(id: number): Promise<Loan | null>;
  getLoansByAccountIBAN(iban: string): Promise<Loan[]>;
  getLoansByBankId(id: number): Promise<Loan[]>;
  repayLoan(id: number, amount: number): Promise<void>;
  deleteLoan(id: number): Promise<void>;
  getAllPendingLoans(): Promise<Loan[]>;
}