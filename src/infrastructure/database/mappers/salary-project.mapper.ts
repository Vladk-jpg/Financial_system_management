import { SalaryProject } from 'src/domain/entities/salary-project';
import { SalaryProjectModel } from '../models/salary-project.model';

export class SalaryProjectMapper {
  static toDomain(model: SalaryProjectModel): SalaryProject {
    const entity = new SalaryProject(model.name);
    entity.isActive = model.isActive;
    entity.id = model.id;
    return entity;
  }
}
