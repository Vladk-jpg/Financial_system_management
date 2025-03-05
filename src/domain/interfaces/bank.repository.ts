import { Bank } from '../entities/bank';

export const BANK_REPOSITORY = 'BANK_REPOSITORY';

export interface IBankRepository {
  create(bank: Bank): Promise<Bank>;
  findById(id: number): Promise<Bank | null>;
  findAll(): Promise<Bank[]>;
  update(id: number, bank: Bank): Promise<Bank | null>;
  delete(id: number): Promise<void>;
}
