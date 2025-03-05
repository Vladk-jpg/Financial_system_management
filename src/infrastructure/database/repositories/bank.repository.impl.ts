import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IBankRepository } from 'src/domain/interfaces/bank.repository';
import { BankModel } from '../models/bank.model';
import { Bank } from 'src/domain/entities/bank';
import { BankMapper } from '../mappers/bank.mapper';

@Injectable()
export class BankRepository implements IBankRepository {
  constructor(
    @InjectRepository(BankModel)
    private readonly bankRepo: Repository<BankModel>,
  ) {}

  async create(bank: Bank): Promise<BankModel> {
    const entity = BankMapper.toModel(bank);
    const savedEntity = await this.bankRepo.save(entity);
    return savedEntity;
  }

  async findById(id: number): Promise<Bank | null> {
    const entity = await this.bankRepo.findOne({ where: { id } });
    return entity ? BankMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Bank[]> {
    const entities = await this.bankRepo.find();
    return entities.map(BankMapper.toDomain);
  }

  async update(id: number, bank: Bank): Promise<Bank | null> {
    const entity = BankMapper.toModel(bank);
    await this.bankRepo.update(id, entity);
    const newBank = await this.findById(id);
    return newBank ? newBank : null;
  }

  async delete(id: number): Promise<void> {
    await this.bankRepo.delete(id);
  }
}
