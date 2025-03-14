export enum UserRole {
  CLIENT = 'CLIENT',
  OPERATOR = 'OPERATOR',
  MANAGER = 'MANAGER',
  ENTERPRISE_SPECIALIST = 'ENTERPRISE_SPECIALIST',
  ADMIN = 'ADMIN',
}

export class User {
  public id!: number;
  public isActive: boolean = false;
  public role: UserRole = UserRole.CLIENT;
  constructor(
    public fullName: string,
    public passportNumber: string,
    public identificationNumber: string,
    public phone: string,
    public email: string,
    public passwordHash: string,
    public isForeign: boolean = false,
  ) {}
}
