export enum UserRole {
  CLIENT = 'CLIENT',
  OPERATOR = 'OPERATOR',
  MANAGER = 'MANAGER',
  ENTERPRISE_SPECIALIST = 'ENTERPRISE_SPECIALIST',
  ADMIN = 'ADMIN',
}

export class User {
  private readonly id: string;
  private fullName: string;
  private passportNumber: string;
  private identificationNumber: string;
  private phone: string;
  private email: string;
  private passwordHash: string;
  private role: UserRole;
  private isForeign: boolean;

  constructor(
    id: string,
    fullName: string,
    passportNumber: string,
    identificationNumber: string,
    phone: string,
    email: string,
    password: string,
    role: UserRole = UserRole.CLIENT,
    isForeign: boolean = false,
  ) {
    this.id = id;
    this.fullName = fullName;
    this.passportNumber = passportNumber;
    this.identificationNumber = identificationNumber;
    this.phone = phone;
    this.email = email;
    this.role = role;
    this.isForeign = isForeign;
    this.passwordHash = password;

    this.validate();
  }

  private validate(): void {
    if (!this.fullName) {
      throw new Error('ФИО не может быть пустым');
    }
    if (!this.passportNumber) {
      throw new Error('Серия и номер паспорта обязательны');
    }
    if (!this.identificationNumber) {
      throw new Error('Идентификационный номер обязателен');
    }
    if (!this.phone) {
      throw new Error('Телефон обязателен');
    }
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Некорректный email');
    }
    if(!this.passwordHash) {
      throw new Error('Пароль не должен быть пустым')
    }
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
