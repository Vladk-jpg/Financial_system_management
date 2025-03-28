import { Enterprise } from '../entities/enterprise';

export interface IEnterpriseRepository {
  create(userId: number, enterprise: Enterprise, isBank?: boolean): Promise<Enterprise | null>;
  findById(id: number): Promise<Enterprise | null>;
  findByBic(bic: string): Promise<Enterprise[]>;
  findAllByUserId(userId: number): Promise<Enterprise[]>;
  update(enterprise: Enterprise): Promise<Enterprise | null>;
  delete(id: number): Promise<void>;
  findByProjectId(id: number): Promise<Enterprise | null>;
}
