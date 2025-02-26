export class CreateUserDTO {
  fullName: string;
  passportNumber: string;
  identificationNumber: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  isForeign: boolean;

  constructor(
    fullName: string,
    passportNumber: string,
    identificationNumber: string,
    phone: string,
    email: string,
    password: string,
    confirmPassword: string,
    isForeign: boolean
  ) {
    this.fullName = fullName;
    this.passportNumber = passportNumber;
    this.identificationNumber = identificationNumber;
    this.phone = phone;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.isForeign = isForeign;
  }
}
