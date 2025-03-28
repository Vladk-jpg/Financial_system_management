import { Transaction } from 'src/domain/entities/transaction';
import { CreateTransactionDTO } from '../dto/create-transaction.dto';

export interface ITransactionService {
  transferFunds(dto: CreateTransactionDTO): Promise<void>;
  getTransactionById(id: number): Promise<Transaction | null>;
  cancelTransaction(id: number): Promise<Transaction | null>;
  getTransactionsByAccountIBAN(iban: string): Promise<Transaction[]>;
  getLatestTransactions(): Promise<Transaction[]>;
  sendSalary(enterpriseId: number, IBAN: string): Promise<void>;
}