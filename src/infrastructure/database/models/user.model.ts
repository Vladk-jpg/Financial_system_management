import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { UserRole } from 'src/domain/entities/user';
import { AccountModel } from './account.model';
import { EnterpriseModel } from './enterprise.model';

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

  @OneToMany(() => AccountModel, (account) => account.user)
  accounts!: AccountModel[];

  @OneToMany(() => EnterpriseModel, (enterprise) => enterprise.user)
  enterprises!: EnterpriseModel[];
}
