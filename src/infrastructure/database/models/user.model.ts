import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { UserRole } from 'src/domain/entities/user';

@Entity('users')
@Unique(['email'])
@Unique(['passportNumber'])
@Unique(['identificationNumber'])
export class UserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: false })
  isActive!: boolean;

  @Column({
    type: 'text',
    default: UserRole.CLIENT,
  })
  role!: UserRole;

  @Column()
  fullName!: string;

  @Column()
  passportNumber!: string;

  @Column()
  identificationNumber!: string;

  @Column()
  phone!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ default: false })
  isForeign!: boolean;
}
