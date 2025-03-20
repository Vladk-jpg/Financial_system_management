import { Bank } from '../entities/bank';

export interface IBankRepository {
  create(bank: Bank): Promise<Bank>;
  findById(id: number): Promise<Bank | null>;
  findAll(): Promise<Bank[]>;
  update(bank: Bank): Promise<Bank | null>;
  delete(id: number): Promise<void>;
  isEnterprise(bic: string): Promise<boolean>;
}
