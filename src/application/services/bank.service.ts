import { IBankRepository } from 'src/domain/repositories/bank.repository';
import { Bank } from 'src/domain/entities/bank';
import { CreateBankDTO } from '../dto/create-bank.dto';
import { UpdateBankDTO } from '../dto/update-bank.dto';
import { ILogger } from 'src/domain/logger/logger.interface';

export class BankService {
  constructor(
    private readonly logger: ILogger,
    private readonly bankRepository: IBankRepository
  ) {}

  async createBank(dto: CreateBankDTO): Promise<Bank> {
    const bank = new Bank(dto.name, dto.bic, dto.address);
    const newBank = await this.bankRepository.create(bank);
    return newBank;
  }

  async getBankById(id: number): Promise<Bank | null> {
    const bank = await this.bankRepository.findById(id);
    return bank;
  }

  async getAllBanks(): Promise<Bank[]> {
    return await this.bankRepository.findAll();
  }

  async updateBank(id: number, dto: UpdateBankDTO): Promise<Bank | null> {
    const bank = new Bank(dto.name, dto.bic, dto.address);
    bank.id = id;
    return await this.bankRepository.update(bank);
  }

  async deleteBank(id: number): Promise<void> {
    await this.bankRepository.delete(id);
  }
}
