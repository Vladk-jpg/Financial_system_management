import { EAccount } from "../entities/e-account";

export interface IEAccountRepository {
  create(eaccount: EAccount): Promise<EAccount | null>;
  findById(id: number, manager?: any): Promise<EAccount | null>;
  findAllByEnterpriseId(id: number): Promise<EAccount[]>;
  findByIBAN(iban: string, manager?: any): Promise<EAccount | null>;
  freeze(id: number): Promise<EAccount | null>;
  delete(id: number): Promise<void>;
  block(id: number): Promise<EAccount | null>;
  deposit(id: number, amount: number, manager: any): Promise<void>;
  withdraw(id: number, amount: number, manager: any): Promise<boolean>;
}
