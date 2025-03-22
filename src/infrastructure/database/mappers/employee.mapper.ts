import { Employee } from 'src/domain/entities/employee';
import { EmployeeModel } from '../models/employee.model';

export class EmployeeMapper {
  static toDomain(model: EmployeeModel): Employee {
    const entity = new Employee(model.IBAN, model.salary, model.position);
    entity.id = model.id;
    return entity;
  }

  static toModel(entity: Employee): EmployeeModel {
    const model = new EmployeeModel();
    model.IBAN = entity.IBAN;
    model.id = entity.id;
    model.position = entity.position;
    model.salary = entity.salary;
    return model;
  }
}
