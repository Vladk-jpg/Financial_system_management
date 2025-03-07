export class CreateUserDTO {
  constructor(
    public fullName: string,
    public passportNumber: string,
    public identificationNumber: string,
    public phone: string,
    public email: string,
    public password: string,
    public confirmPassword: string,
    public isForeign: boolean
  ) {}
}
