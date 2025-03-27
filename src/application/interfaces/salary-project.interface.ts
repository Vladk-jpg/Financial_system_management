import { SalaryProject } from 'src/domain/entities/salary-project';
import { Employee } from 'src/domain/entities/employee';
import { CreateSalaryProjectDTO } from '../dto/create-salary-project.dto';
import { CreateEmployeeDTO } from '../dto/create-employee.dto';

export interface ISalaryProjectService {
  createSalaryProject(
    enterId: number,
    dto: CreateSalaryProjectDTO,
  ): Promise<SalaryProject | null>;
  deleteSalaryProject(id: number): Promise<void>;
  updateSalaryProject(project: SalaryProject): Promise<SalaryProject | null>;
  findById(id: number): Promise<SalaryProject | null>;
  findByEnterpriseId(id: number): Promise<SalaryProject | null>;
  createEmployee(
    projectId: number,
    dto: CreateEmployeeDTO,
  ): Promise<Employee | null>;
  deleteEmployee(projectId: number, employeeId: number): Promise<void>;
  getAllEmployees(projectId: number): Promise<Employee[]>;
  activateSalaryProject(projectId: number): Promise<void>;
  getAllInactiveProjects(): Promise<SalaryProject[]>;
}
