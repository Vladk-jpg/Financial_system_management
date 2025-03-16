import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserModel } from './user.model';
import { BankModel } from './bank.model';
import { AccountState } from 'src/domain/entities/account';

@Entity('bank_accounts')
export class AccountModel {
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

  @ManyToOne(() => UserModel, (user) => user.accounts, { onDelete: 'CASCADE' })
  user!: UserModel;

  @ManyToOne(() => BankModel, (bank) => bank.accounts, { onDelete: 'CASCADE' })
  bank!: BankModel;
}
