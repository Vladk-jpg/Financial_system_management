import { Employee } from 'src/domain/entities/employee';
import { SalaryProject } from 'src/domain/entities/salary-project';
import { ISalaryProjectRepository } from 'src/domain/repositories/salary-project.repository';
import { EmployeeModel } from '../models/employee.model';
import { SalaryProjectModel } from '../models/salary-project.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalaryProjectMapper } from '../mappers/salary-project.mapper';
import { EnterpriseModel } from '../models/enterprise.model';
import { EmployeeMapper } from '../mappers/employee.mapper';

export class SalaryProjectRepository implements ISalaryProjectRepository {
  constructor(
    @InjectRepository(EmployeeModel)
    private readonly employeeRepo: Repository<EmployeeModel>,
    @InjectRepository(SalaryProjectModel)
    private readonly sProjectRepo: Repository<SalaryProjectModel>,
    @InjectRepository(EnterpriseModel)
    private readonly enterpriseRepo: Repository<EnterpriseModel>,
  ) {}

  async findByEnterpriseId(id: number): Promise<SalaryProject | null> {
    const salaryProject = await this.sProjectRepo.findOne({
      where: { enterprise: { id: id } },
      relations: ['enterprise'],
    });
    return salaryProject;
  }

  async create(
    project: SalaryProject,
    enterId: number,
  ): Promise<SalaryProject | null> {
    const prjct = new SalaryProjectModel();
    prjct.name = project.name;
    const enterprise = await this.enterpriseRepo.findOne({
      where: { id: enterId },
    });
    if (!enterprise) return null;
    prjct.enterprise = enterprise;
    const savedEntity = await this.sProjectRepo.save(prjct);
    if (!savedEntity) return null;
    return SalaryProjectMapper.toDomain(savedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.sProjectRepo.delete(id);
  }

  async update(project: SalaryProject): Promise<SalaryProject | null> {
    const salaryProject = await this.sProjectRepo.findOne({
      where: { id: project.id },
    });
    if (!salaryProject) return null;
    salaryProject.name = project.name;
    salaryProject.isActive = project.isActive;
    await this.sProjectRepo.update(salaryProject.id, salaryProject);
    return project;
  }

  async findById(id: number): Promise<SalaryProject | null> {
    const salaryProject = await this.sProjectRepo.findOne({
      where: { id: id },
    });
    return salaryProject ? SalaryProjectMapper.toDomain(salaryProject) : null;
  }

  async findAllEmployees(projectId: number): Promise<Employee[]> {
    const project = await this.sProjectRepo.findOne({
      where: { id: projectId },
    });
    if (!project) return [];
    const employees = await this.employeeRepo.find({
      where: { salaryProject: { id: projectId } },
      relations: ['salaryProject'],
    });
    return employees.map(EmployeeMapper.toDomain);
  }

  async createEmployee(
    projectId: number,
    employee: Employee,
  ): Promise<Employee | null> {
    const project = await this.sProjectRepo.findOne({
      where: { id: projectId },
    });
    if (!project) return null;
    const model = EmployeeMapper.toModel(employee);
    model.salaryProject = project;
    const saved = await this.employeeRepo.save(model);
    return saved ? EmployeeMapper.toDomain(saved) : null;
  }

  async deleteEmployee(employeeId: number): Promise<void> {
    await this.employeeRepo.delete(employeeId);
  }

  async findEmployeeById(id: number): Promise<Employee | null> {
    const empl = await this.employeeRepo.findOne({ where: { id: id } });
    return empl ? EmployeeMapper.toDomain(empl) : null;
  }

  async findAllInactive(): Promise<SalaryProject[]> {
    const projects = await this.sProjectRepo.find({
      where: { isActive: false },
    });
    return projects.map(SalaryProjectMapper.toDomain);
  }
}
