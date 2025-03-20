import { Injectable } from '@nestjs/common';
import { Enterprise } from 'src/domain/entities/enterprise';
import { IEnterpriseRepository } from 'src/domain/repositories/enterprise.repository';
import { BankModel } from '../models/bank.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnterpriseModel } from '../models/enterprise.model';
import { UserModel } from '../models/user.model';
import { EnterpriseMapper } from '../mappers/enterprise.mapper';

@Injectable()
export class EnterpriseRepository implements IEnterpriseRepository {
  constructor(
    @InjectRepository(BankModel)
    private readonly bankRepo: Repository<BankModel>,
    @InjectRepository(EnterpriseModel)
    private readonly EnterpiseRepo: Repository<EnterpriseModel>,
    @InjectRepository(UserModel)
    private readonly UserRepo: Repository<UserModel>,
  ) {}

  async create(
    userId: number,
    enterprise: Enterprise,
    isBank?: boolean,
  ): Promise<Enterprise | null> {
    const user = await this.UserRepo.findOne({
      where: { id: userId },
    });
    if (!user) throw new Error("User not found");
    const model = EnterpriseMapper.toModel(enterprise);
    model.user = user;
    const bank = isBank
      ? await this.bankRepo.findOne({ where: { bic: enterprise.bic } })
      : null;
    if (bank) model.bank = bank;
    const entity = await this.EnterpiseRepo.save(model);
    return entity ? EnterpriseMapper.toDomain(entity) : null;
  }

  async findById(id: number): Promise<Enterprise | null> {
    const enterprise = await this.EnterpiseRepo.findOne({ where: { id: id } });
    return enterprise ? EnterpriseMapper.toDomain(enterprise) : null;
  }

  async findByBic(bic: string): Promise<Enterprise[]> {
    const enterprises = await this.EnterpiseRepo.find({
      where: { bic: bic },
    });
    return enterprises.map(EnterpriseMapper.toDomain);
  }

  async findAllByUserID(userId: number): Promise<Enterprise[]> {
    const enterprises = await this.EnterpiseRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    return enterprises.map(EnterpriseMapper.toDomain);
  }

  async update(enterprise: Enterprise): Promise<Enterprise | null> {
    throw new Error('Method not implemented.');
  }

  async delete(id: number): Promise<void> {
    await this.EnterpiseRepo.delete(id);
  }
}
