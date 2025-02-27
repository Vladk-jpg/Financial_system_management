import { Injectable, Inject } from '@nestjs/common';
import { IBankRepository } from 'src/domain/interfaces/bank.repository';
import { Bank } from 'src/domain/entities/bank';
import { BANK_REPOSITORY } from 'src/domain/interfaces/bank.repository';
import { CreateBankDTO } from '../dto/create-bank.dto';

@Injectable()
export class CreateBankUseCase {
  constructor(@Inject(BANK_REPOSITORY) private readonly bankRepository: IBankRepository) {}

  async execute(dto: CreateBankDTO): Promise<Bank> {
    const bank = new Bank(dto.name, dto.bic, dto.address);
    return await this.bankRepository.create(bank);
  }
}
