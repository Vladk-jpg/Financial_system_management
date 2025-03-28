import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SalaryProjectModel } from './salary-project.model';

@Entity('employees')
export class EmployeeModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  IBAN!: string;

  @Column()
  position!: string;

  @Column({ type: 'integer' })
  salary!: number;

  @ManyToOne(
    () => SalaryProjectModel,
    (salaryProject) => salaryProject.employees,
    { nullable: true, onDelete: 'CASCADE'},
  )
  salaryProject!: SalaryProjectModel;
}
