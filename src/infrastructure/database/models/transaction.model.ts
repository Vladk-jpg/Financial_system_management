import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ParticipantType } from 'src/domain/entities/transaction';
import { OperationState } from 'src/domain/enums/operation-state.enum';

@Entity('transactions')
export class TransactionModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', default: OperationState.COMPLITED })
  state!: OperationState;

  @Column({ type: 'text' })
  senderType!: ParticipantType;

  @Column()
  senderId!: number;

  @Column({ type: 'text' })
  recipientType!: ParticipantType;

  @Column()
  recipientId!: number;

  @Column({ type: 'integer' })
  amount!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
