import { Account } from '../entities/account';

export interface IAccountRepository {
  create(account: Account): Promise<Account | null>;
  findById(id: number): Promise<Account | null>;
  findAllByUserId(id: number): Promise<Account[]>;
  freeze(id: number): Promise<Account | null>;
  delete(id: number): Promise<void>;
  block(id: number): Promise<Account | null>;
}
