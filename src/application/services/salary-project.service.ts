import { SalaryProject } from 'src/domain/entities/salary-project';
import { IException } from 'src/domain/interfaces/exceptions.interface';
import { IEnterpriseRepository } from 'src/domain/repositories/enterprise.repository';
import { ISalaryProjectRepository } from 'src/domain/repositories/salary-project.repository';
import { CreateEmployeeDTO } from '../dto/create-employee.dto';
import { Employee } from 'src/domain/entities/employee';
import { CreateSalaryProjectDTO } from '../dto/create-salary-project.dto';

export class SalaryProjectService {
  constructor(
    private readonly sProjectRepo: ISalaryProjectRepository,
    private readonly enterpriseRepo: IEnterpriseRepository,
    private readonly exception: IException,
  ) {}

  async createSalaryProject(
    enterId: number,
    dto: CreateSalaryProjectDTO,
  ): Promise<SalaryProject | null> {
    const salaryProject = new SalaryProject(dto.name);
    const enterprise = this.enterpriseRepo.findById(enterId);
    if (!enterprise) {
      this.exception.NotFoundException({ message: 'Enterprise not found' });
      return null;
    }
    const isExist = await this.sProjectRepo.findByEnterpriseId(enterId);
    if (isExist) {
      this.exception.forbiddenException({
        message: 'Salary project is already exist for this enterprise',
      });
    }
    const created = await this.sProjectRepo.create(salaryProject, enterId);
    return created;
  }

  async deleteSalaryProject(id: number): Promise<void> {
    const salary = await this.sProjectRepo.findById(id);
    if (!salary) {
      this.exception.NotFoundException({
        message: 'Salary project with such id not found',
      });
    }
    await this.sProjectRepo.delete(id);
  }

  async updateSalaryProject(
    project: SalaryProject,
  ): Promise<SalaryProject | null> {
    const updated = await this.sProjectRepo.update(project);
    return updated;
  }

  async findByEnterpriseId(id: number): Promise<SalaryProject | null> {
    return await this.sProjectRepo.findByEnterpriseId(id);
  }

  async createEmployee(
    projectId: number,
    dto: CreateEmployeeDTO,
  ): Promise<Employee | null> {
    const employee = new Employee(dto.IBAN, dto.salary, dto.position);
    const created = this.sProjectRepo.createEmployee(projectId, employee);
    if (!created) {
      this.exception.badRequestException({
        message: 'Failure to create employee',
      });
      return null;
    }
    return created;
  }

  async deleteEmployee(projectId: number, employeeId: number): Promise<void> {
    const project = await this.sProjectRepo.findById(projectId);
    if (!project) {
      this.exception.NotFoundException({ message: 'Salary project not found' });
    }
    const employees = await this.sProjectRepo.findAllEmployees(projectId);
    var was = false;
    for (const empl of employees) {
      if (empl.id == employeeId) {
        was = true;
        break;
      }
    }
    if (!was)
      this.exception.NotFoundException({ message: 'Employee not found' });
    await this.sProjectRepo.deleteEmployee(employeeId);
  }

  async getAllEmployees(projectId: number): Promise<Employee[]> {
    const project = await this.sProjectRepo.findById(projectId);
    if (!project) {
      this.exception.NotFoundException({ message: 'Salary project not found' });
    }
    return await this.sProjectRepo.findAllEmployees(projectId);
  }
}
