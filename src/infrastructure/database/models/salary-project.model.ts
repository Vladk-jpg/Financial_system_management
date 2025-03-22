import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { EmployeeModel } from './employee.model';
import { EnterpriseModel } from './enterprise.model';

@Entity('salaryProjects')
@Unique(['name'])
export class SalaryProjectModel {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column({ default: false })
  public isActive!: boolean;

  @OneToMany(() => EmployeeModel, (employee) => employee.salaryProject)
  employees!: EmployeeModel[];

  @OneToOne(() => EnterpriseModel, (enterprise) => enterprise.salaryProject)
  @JoinColumn()
  enterprise!: EnterpriseModel;
}
