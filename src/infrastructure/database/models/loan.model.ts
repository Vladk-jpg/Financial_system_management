import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BankModel } from './bank.model';
import { LoanSatus } from 'src/domain/entities/loan';
import { ParticipantType } from 'src/domain/entities/transaction';

@Entity('loans')
export class LoanModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  amount!: number;

  @Column({ type: 'text' })
  status!: LoanSatus;

  @Column()
  accountIBAN!: string;

  @Column({ type: 'text' })
  accountType!: ParticipantType;

  @ManyToOne(() => BankModel, (bank) => bank.loans, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  bank!: BankModel;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  interestRate!: number;

  @Column({ type: 'int' })
  termMonths!: number;

  @Column({ type: 'integer' })
  remainingBalance!: number;

  @Column()
  issueDate!: Date;
}
