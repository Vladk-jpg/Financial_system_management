import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IBankRepository } from 'src/domain/interfaces/bank.repository';
import { BankEntity } from '../entities/bank.entity';
import { Bank } from 'src/domain/entities/bank';
import { BankMapper } from '../mappers/bank.mapper';

@Injectable()
export class BankRepository implements IBankRepository {
  constructor(
    @InjectRepository(BankEntity)
    private readonly bankRepo: Repository<BankEntity>,
  ) {}

  async create(bank: Bank): Promise<BankEntity> {
    const entity = BankMapper.toEntity(bank);
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

  async update(id: number, bank: Partial<Bank>): Promise<Bank> {
    await this.bankRepo.update(id, bank);
    return (await this.findById(id)) as Bank;
  }

  async delete(id: number): Promise<void> {
    await this.bankRepo.delete(id);
  }
}
