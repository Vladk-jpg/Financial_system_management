import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, OneToOne } from 'typeorm';
import { AccountModel } from './account.model';
import { EnterpriseModel } from './enterprise.model';

@Entity('banks')
@Unique(['name', 'bic'])
export class BankModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  bic!: string;

  @Column()
  address!: string;

  @OneToMany(() => AccountModel, (account) => account.bank)
  accounts!: AccountModel[];

  @OneToOne(() => EnterpriseModel, (enterprise) => enterprise.bank, { nullable: true })
  enterprise!: EnterpriseModel;
}
