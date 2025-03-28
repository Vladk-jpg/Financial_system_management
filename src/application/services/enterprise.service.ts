import { IBankRepository } from 'src/domain/repositories/bank.repository';
import { IEnterpriseRepository } from 'src/domain/repositories/enterprise.repository';
import { createEnterpriseDTO } from '../dto/create-enterprise.dto';
import { Enterprise } from 'src/domain/entities/enterprise';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { UserRole } from 'src/domain/entities/user';
import { IEnterpriseService } from '../interfaces/enterprise.interface';

export class EnterpriseService implements IEnterpriseService {
  constructor(
    private readonly enterpriseRepo: IEnterpriseRepository,
    private readonly bankRepo: IBankRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async createEnterprise(
    dto: createEnterpriseDTO,
    userId: number,
  ): Promise<Enterprise | null> {
    if (dto.isBank) {
      const isExist = await this.bankRepo.isEnterprise(dto.bic);
      if (isExist) return null;
    }
    const enterprise = new Enterprise(
      dto.name,
      dto.type,
      dto.unp,
      dto.bic,
      dto.address,
    );
    const savedEnterprise = await this.enterpriseRepo.create(
      userId,
      enterprise,
      dto.isBank,
    );
    if (!savedEnterprise) return null;

    const user = await this.userRepo.findById(userId);
    if (user && user.role != UserRole.ADMIN) {
      user.role = UserRole.ENTERPRISE_SPECIALIST;
      const updatedUser = await this.userRepo.update(user);
      if (!updatedUser) return null;
    }
    return savedEnterprise;
  }

  async getById(id: number): Promise<Enterprise | null> {
    const enterprise = await this.enterpriseRepo.findById(id);
    return enterprise;
  }

  async getAllByBic(bic: string): Promise<Enterprise[]> {
    const enterprises = await this.enterpriseRepo.findByBic(bic);
    return enterprises;
  }

  async getAllByUserId(id: number): Promise<Enterprise[]> {
    const enterprises = await this.enterpriseRepo.findAllByUserId(id);
    return enterprises;
  }

  async deleteEnterprise(id: number): Promise<void> {
    await this.enterpriseRepo.delete(id);
  }

  async getByProjectId(id: number): Promise<Enterprise | null> {
    return await this.enterpriseRepo.findByProjectId(id);
  }
}
