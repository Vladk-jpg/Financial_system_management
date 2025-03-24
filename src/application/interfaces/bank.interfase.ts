import { Bank } from 'src/domain/entities/bank';
import { CreateBankDTO } from '../dto/create-bank.dto';
import { UpdateBankDTO } from '../dto/update-bank.dto';

export interface IBankService {
  createBank(dto: CreateBankDTO): Promise<Bank>;
  getBankById(id: number): Promise<Bank | null>;
  getAllBanks(): Promise<Bank[]>;
  updateBank(id: number, dto: UpdateBankDTO): Promise<Bank | null>;
  deleteBank(id: number): Promise<void>;
}