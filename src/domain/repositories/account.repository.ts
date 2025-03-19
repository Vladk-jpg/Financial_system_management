import { Account } from '../entities/account';

export interface IAccountRepository {
  create(account: Account): Promise<Account | null>;
  findById(id: number, manager?: any): Promise<Account | null>;
  findAllByUserId(id: number): Promise<Account[]>;
  findByIBAN(iban: string, manager?: any): Promise<Account | null>;
  freeze(id: number): Promise<Account | null>;
  delete(id: number): Promise<void>;
  block(id: number): Promise<Account | null>;
  deposit(id: number, amount: number, manager: any): Promise<void>;
  withdraw(id: number, amount: number, manager: any): Promise<boolean>;
}
