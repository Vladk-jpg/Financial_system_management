import { Employee } from "../entities/employee";
import { SalaryProject } from "../entities/salary-project";

export interface ISalaryProjectRepository {
  create(project: SalaryProject, enterId: number): Promise<SalaryProject | null>;
  delete(id: number): Promise<void>;
  update(project: SalaryProject): Promise<SalaryProject | null>;
  findById(id: number): Promise<SalaryProject | null>;
  findByEnterpriseId(id: number): Promise<SalaryProject | null>;
  findAllEmployees(projectId: number): Promise<Employee[]>;
  createEmployee(projectId: number, employee: Employee): Promise<Employee | null>;
  deleteEmployee(employeeId: number): Promise<void>;
  findEmployeeById(id: number): Promise<Employee | null>;
}