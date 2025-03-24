import { Account } from 'src/domain/entities/account';

export interface IAccountService {
  createAccount(bankId: number, userId: number): Promise<Account | null>;
  findById(id: number): Promise<Account | null>;
  findAllByUserId(userId: number): Promise<Account[]>;
  freezeAccount(id: number): Promise<Account | null>;
  blockAccount(id: number): Promise<Account | null>;
  deleteAccount(id: number): Promise<void>;
}