import { Injectable, Inject } from '@nestjs/common';
import {
  IBankRepository,
  BANK_REPOSITORY,
} from 'src/domain/interfaces/bank.repository';
import { Bank } from 'src/domain/entities/bank';
import { CreateBankDTO } from '../dto/create-bank.dto';
import { UpdateBankDTO } from '../dto/update-bank.dto';

@Injectable()
export class BankService {
  constructor(
    @Inject(BANK_REPOSITORY) private readonly bankRepository: IBankRepository,
  ) {}

  async createBank(dto: CreateBankDTO): Promise<Bank> {
    const bank = new Bank(dto.name, dto.bic, dto.address);
    return await this.bankRepository.create(bank);
  }

  async getBankById(id: number): Promise<Bank> {
    const bank = await this.bankRepository.findById(id);
    if (!bank) throw new Error('Bank does not exis');
    return bank;
  }

  async getAllBanks(): Promise<Bank[]> {
    return await this.bankRepository.findAll();
  }

  async updateBank(id: number, dto: UpdateBankDTO): Promise<Bank> {
    const bank = new Bank(dto.name, dto.bic, dto.address);
    const res = await this.bankRepository.update(id, bank);
    if (!res) throw new Error('Bank does not exist');
    return res;
  }

  async deleteBank(id: number): Promise<void> {
    await this.bankRepository.delete(id);
  }
}
