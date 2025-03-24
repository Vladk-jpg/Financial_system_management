import { EAccount } from 'src/domain/entities/e-account';
import { IIBANgenerator } from 'src/domain/interfaces/iban-gen.interface';
import { IBankRepository } from 'src/domain/repositories/bank.repository';
import { IEAccountRepository } from 'src/domain/repositories/e-account.repository';
import { IEnterpriseRepository } from 'src/domain/repositories/enterprise.repository';
import { IEAccountService } from '../interfaces/e-account.interface';

export class EAccountService implements IEAccountService {
  constructor(
    private readonly eaccountRepository: IEAccountRepository,
    private readonly bankRepository: IBankRepository,
    private readonly enterRepository: IEnterpriseRepository,
    private readonly IBANService: IIBANgenerator,
  ) {}

  async createEAccount(enterpriseId: number, userId: number): Promise<EAccount | null> {
    const enterprises = await this.enterRepository.findAllByUserId(userId);
    const exist = enterprises.some(item => item.id == enterpriseId);
    if(!exist) return null;
    const enterprise = await this.enterRepository.findById(enterpriseId);
    if (!enterprise) throw new Error("No enterprise");
    const bank = await this.bankRepository.findByBic(enterprise.bic);
    if (!bank) throw new Error("No bank");
    const IBAN = await this.IBANService.generateIBANforEAccount(
      bank.id,
      enterpriseId,
    );
    const eaccount = new EAccount(IBAN, bank.id, enterpriseId);
    const created = await this.eaccountRepository.create(eaccount);
    return created;
  }

  async findById(id: number): Promise<EAccount | null> {
    const eaccount = await this.eaccountRepository.findById(id);
    return eaccount;
  }

  async findAllByEnterpriseId(enterpriseId: number): Promise<EAccount[]> {
    const eaccounts =
      await this.eaccountRepository.findAllByEnterpriseId(enterpriseId);
    return eaccounts;
  }

  async freezeEAccount(id: number): Promise<EAccount | null> {
    const eaccount = await this.eaccountRepository.freeze(id);
    return eaccount;
  }

  async blockEAccount(id: number): Promise<EAccount | null> {
    const eaccount = await this.eaccountRepository.block(id);
    return eaccount;
  }

  async deleteEAccount(id: number): Promise<void> {
    await this.eaccountRepository.delete(id);
  }
}
