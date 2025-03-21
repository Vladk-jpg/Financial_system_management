import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { EnterpriseModel } from './enterprise.model';
import { BankModel } from './bank.model';
import { AccountState } from 'src/domain/entities/account';

@Entity('bank_eaccounts')
export class EAccountModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'text',
    default: AccountState.ACTIVE,
  })
  state!: AccountState;

  @Column({ unique: true })
  IBAN!: string;

  @Column({ type: 'integer', default: 0 })
  balance!: number;

  @ManyToOne(() => EnterpriseModel, (enterprise) => enterprise.eaccounts, { onDelete: 'CASCADE' })
  enterprise!: EnterpriseModel;

  @ManyToOne(() => BankModel, (bank) => bank.accounts, { onDelete: 'CASCADE' })
  bank!: BankModel;
}
