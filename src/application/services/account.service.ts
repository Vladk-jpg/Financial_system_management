import { Account } from 'src/domain/entities/account';
import { IIBANgenerator } from 'src/domain/interfaces/iban-gen.interface';
import { IAccountRepository } from 'src/domain/repositories/account.repository';

export class AccountService {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly IBANService: IIBANgenerator,
  ) {}

  async createAccount(bankId: number, userId: number): Promise<Account | null> {
    const IBAN = await this.IBANService.generateIBAN(bankId, userId);
    const account = new Account(IBAN, bankId, userId);
    const created = await this.accountRepository.create(account);
    return created;
  }

  async findById(id: number): Promise<Account | null> {
    const account = await this.accountRepository.findById(id);
    return account;
  }

  async findAllByUserId(userId: number): Promise<Account[]> {
    const accounts = await this.accountRepository.findAllByUserId(userId);
    return accounts;
  }

  async freezeAccount(id: number): Promise<Account | null> {
    const account = await this.accountRepository.freeze(id);
    return account;
  }

  async blockAccount(id: number): Promise<Account | null> {
    const account = await this.accountRepository.block(id);
    return account;
  }

  async deleteAccount(id: number): Promise<void> {
    await this.accountRepository.delete(id);
  }

}
