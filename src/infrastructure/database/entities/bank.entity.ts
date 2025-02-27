import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('banks')
export class BankEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  bic!: string;

  @Column()
  address!: string;
}
