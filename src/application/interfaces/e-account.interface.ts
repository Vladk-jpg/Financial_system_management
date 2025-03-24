import { EAccount } from 'src/domain/entities/e-account';

export interface IEAccountService {
  createEAccount(enterpriseId: number, userId: number): Promise<EAccount | null>;
  findById(id: number): Promise<EAccount | null>;
  findAllByEnterpriseId(enterpriseId: number): Promise<EAccount[]>;
  freezeEAccount(id: number): Promise<EAccount | null>;
  blockEAccount(id: number): Promise<EAccount | null>;
  deleteEAccount(id: number): Promise<void>;
}