import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

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
}
