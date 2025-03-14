import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IBankRepository } from 'src/domain/repositories/bank.repository';
import { BankModel } from '../models/bank.model';
import { Bank } from 'src/domain/entities/bank';
import { BankMapper } from '../mappers/bank.mapper';

@Injectable()
export class BankRepository implements IBankRepository {
  constructor(
    @InjectRepository(BankModel)
    private readonly bankRepo: Repository<BankModel>,
  ) {}

  async create(bank: Bank): Promise<Bank> {
    const entity = BankMapper.toModel(bank);
    const savedEntity = await this.bankRepo.save(entity);
    return BankMapper.toDomain(savedEntity);
  }

  async findById(id: number): Promise<Bank | null> {
    const entity = await this.bankRepo.findOne({ where: { id: id } });
    return entity ? BankMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Bank[]> {
    const entities = await this.bankRepo.find();
    return entities.map(BankMapper.toDomain);
  }

  async update(bank: Bank): Promise<Bank | null> {
    const model = BankMapper.toModel(bank);
    await this.bankRepo.update(model.id, model);
    const newBank = await this.findById(model.id);
    return newBank ? newBank : null;
  }

  async delete(id: number): Promise<void> {
    await this.bankRepo.delete(id);
  }

}
