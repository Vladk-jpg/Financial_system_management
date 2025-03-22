import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { UserModel } from './user.model';
import { BankModel } from './bank.model';
import { EAccountModel } from './e-account.model';
import { SalaryProjectModel } from './salary-project.model';

@Entity('enterprises')
@Unique(['name'])
export class EnterpriseModel {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column()
  public type!: string;

  @Column()
  public unp!: string;

  @Column()
  public bic!: string;

  @Column()
  public address!: string;

  @ManyToOne(() => UserModel, (user) => user.enterprises, { nullable: true })
  @JoinColumn()
  public user!: UserModel | null;

  @OneToOne(() => BankModel, { nullable: true })
  @JoinColumn()
  public bank!: BankModel | null;

  @OneToMany(() => EAccountModel, (eaccount) => eaccount.enterprise)
  eaccounts!: EAccountModel[];

  @OneToOne(() => SalaryProjectModel, (salaryProject) => salaryProject.enterprise)
  salaryProject!: SalaryProjectModel;
}
