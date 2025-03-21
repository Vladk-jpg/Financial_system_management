import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EAccount } from 'src/domain/entities/e-account';
import { IEAccountRepository } from 'src/domain/repositories/e-account.repository';
import { EnterpriseModel } from '../models/enterprise.model';
import { EntityManager, Repository } from 'typeorm';
import { BankModel } from '../models/bank.model';
import { EAccountModel } from '../models/e-account.model';
import { EAccountMapper } from '../mappers/e-account.mapper';
import { AccountState } from 'src/domain/entities/account';

@Injectable()
export class EAccountRepository implements IEAccountRepository {
  constructor(
    @InjectRepository(EnterpriseModel)
    private readonly enterpriseRepo: Repository<EnterpriseModel>,
    @InjectRepository(BankModel)
    private readonly bankRepo: Repository<BankModel>,
    @InjectRepository(EAccountModel)
    private readonly eaccountRepo: Repository<EAccountModel>,
  ) {}

  async create(eaccount: EAccount): Promise<EAccount | null> {
    const bank = await this.bankRepo.findOne({ where: { id: eaccount.bank } });
    const enterprise = await this.enterpriseRepo.findOne({
      where: { id: eaccount.enterprise },
    });
    if (!bank || !enterprise) return null;
    if (bank.bic != enterprise.bic) return null;

    const model = new EAccountModel();
    model.IBAN = eaccount.IBAN;
    model.balance = eaccount.balance;
    model.state = eaccount.state;
    model.bank = bank;
    model.enterprise = enterprise;
    const saved = await this.eaccountRepo.save(model);
    return EAccountMapper.toDomain(saved);
  }

  async findById(
    id: number,
    manager?: EntityManager,
  ): Promise<EAccount | null> {
    const repo = manager
      ? manager.getRepository(EAccountModel)
      : this.eaccountRepo;
    const eaccount = await repo.findOne({
      where: { id: id },
      relations: ['enterprise', 'bank'],
    });
    return eaccount ? EAccountMapper.toDomain(eaccount) : null;
  }

  async findAllByEnterpriseId(id: number): Promise<EAccount[]> {
    const accounts = await this.eaccountRepo.find({
      where: { enterprise: { id: id } },
      relations: ['enterprise', 'bank'],
    });
    return accounts.map(EAccountMapper.toDomain);
  }

  async findByIBAN(iban: string, manager?: any): Promise<EAccount | null> {
    const repo = manager
      ? manager.getRepository(EAccountModel)
      : this.eaccountRepo;
    const eaccount = await repo.findOne({
      where: { iban: iban },
      relations: ['enterprise', 'bank'],
    });
    return eaccount ? EAccountMapper.toDomain(eaccount) : null;
  }

  async freeze(id: number): Promise<EAccount | null> {
    const eaccount = await this.eaccountRepo.findOne({
      where: { id: id },
    });
    if (!eaccount) return null;
    eaccount.state = AccountState.FROZEN;
    await this.eaccountRepo.update(id, eaccount);
    const updatedEAccount = await this.findById(id);
    return updatedEAccount;
  }

  async delete(id: number): Promise<void> {
    await this.eaccountRepo.delete(id);
  }

  async block(id: number): Promise<EAccount | null> {
    const eaccount = await this.eaccountRepo.findOne({
      where: { id: id },
    });
    if (!eaccount) return null;
    eaccount.state = AccountState.BLOCKED;
    await this.eaccountRepo.update(id, eaccount);
    const updatedEAccount = await this.findById(id);
    return updatedEAccount;
  }

  async deposit(id: number, amount: number, manager: any): Promise<void> {
    const repo = manager.getRepository(EAccountModel);
    await repo.increment({ id }, 'balance', amount);
  }

  async withdraw(id: number, amount: number, manager: any): Promise<boolean> {
    const repo = manager.getRepository(EAccountModel);
    const eaccount = await this.findById(id, manager);
    if (!eaccount || eaccount.balance < amount) {
      return false;
    }
    await repo.decrement({ id }, 'balance', amount);
    return true;
  }
}
