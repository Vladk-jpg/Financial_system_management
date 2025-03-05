import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('banks')
export class BankModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  bic!: string;

  @Column()
  address!: string;
}
