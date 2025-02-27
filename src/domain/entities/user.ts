export enum UserRole {
  CLIENT = 'CLIENT',
  OPERATOR = 'OPERATOR',
  MANAGER = 'MANAGER',
  ENTERPRISE_SPECIALIST = 'ENTERPRISE_SPECIALIST',
  ADMIN = 'ADMIN',
}

export class User {
  constructor(
    private readonly id: string,
    private fullName: string,
    private passportNumber: string,
    private identificationNumber: string,
    private phone: string,
    private email: string,
    private passwordHash: string,
    private role: UserRole = UserRole.CLIENT,
    private isForeign: boolean = false,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new Error('ID is required');
    if (!this.fullName) throw new Error('Full name is required');
    if (!this.passportNumber) throw new Error('Passport number is required');
    if (!this.identificationNumber)
      throw new Error('Identification number is required');
    if (!this.phone) throw new Error('Phone is required');
    if (!this.email || !this.email.includes('@'))
      throw new Error('Incorrect Email');
    if (!this.passwordHash) throw new Error('Password is required');
  }

  getId(): string {
    return this.id;
  }

  getFullName(): string {
    return this.fullName;
  }

  getPassportNumber(): string {
    return this.passportNumber;
  }

  getIdentificationNumber(): string {
    return this.identificationNumber;
  }

  getPhone(): string {
    return this.phone;
  }

  getEmail(): string {
    return this.email;
  }

  getRole(): UserRole {
    return this.role;
  }

  isForeignClient(): boolean {
    return this.isForeign;
  }

  changeRole(newRole: UserRole): void {
    this.role = newRole;
  }
}
