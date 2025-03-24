import { Enterprise } from 'src/domain/entities/enterprise';
import { createEnterpriseDTO } from '../dto/create-enterprise.dto';

export interface IEnterpriseService {
  createEnterprise(dto: createEnterpriseDTO, userId: number): Promise<Enterprise | null>;
  getById(id: number): Promise<Enterprise | null>;
  getAllByBic(bic: string): Promise<Enterprise[]>;
  getAllByUserId(id: number): Promise<Enterprise[]>;
  deleteEnterprise(id: number): Promise<void>;
}