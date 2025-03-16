import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, AccountState } from 'src/domain/entities/account';
import { IAccountRepository } from 'src/domain/repositories/account.repository';
import { AccountModel } from '../models/account.model';
import { Repository } from 'typeorm';
import { BankModel } from '../models/bank.model';
import { UserModel } from '../models/user.model';
import { BankMapper } from '../mappers/bank.mapper';
import { UserMapper } from '../mappers/user.mapper';
import { AccountMapper } from '../mappers/account.mapper';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(AccountModel)
    private readonly accountRepo: Repository<AccountModel>,
    @InjectRepository(BankModel)
    private readonly bankRepo: Repository<BankModel>,
    @InjectRepository(UserModel)
    private readonly userRepo: Repository<UserModel>,
  ) {}

  async create(account: Account): Promise<Account | null> {
    const bank = await this.bankRepo.findOne({ where: { id: account.bank } });
    const user = await this.userRepo.findOne({ where: { id: account.user } });
    if (!bank || !user) return null;

    const model = new AccountModel();
    model.IBAN = account.IBAN;
    model.balance = account.balance;
    model.state = account.state;
    model.bank = BankMapper.toModel(bank);
    model.user = UserMapper.toModel(user);

    const savedEntity = await this.accountRepo.save(model);
    return AccountMapper.toDomain(savedEntity);
  }

  async findById(id: number): Promise<Account | null> {
    const account = await this.accountRepo.findOne({ where: { id: id } });
    return account ? AccountMapper.toDomain(account) : null;
  }

  async findAllByUserId(id: number): Promise<Account[]> {
    const accounts = await this.accountRepo.find({
      where: { user: { id: id } },
      relations: ['user', 'bank'],
    });
    return accounts.map(AccountMapper.toDomain);
  }

  async freeze(id: number): Promise<Account | null> {
    const account = await this.accountRepo.findOne({ where: { id: id } });
    if (!account) return null;
    account.state = AccountState.FROZEN;
    await this.accountRepo.update(id, account);
    const updatedAccount = await this.findById(id);
    return updatedAccount;
  }

  async updateIBAN(id: number, IBAN: string): Promise<Account | null> {
    const account = await this.accountRepo.findOne({ where: { id } });
    if (!account) return null;
    account.IBAN = IBAN;
    await this.accountRepo.update(id, account);
    const updatedAccount = await this.findById(id);
    return updatedAccount;
  }
}
