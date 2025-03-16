export class UpdateProfileDTO {
  constructor(
    public fullName: string,
    public passportNumber: string,
    public identificationNumber: string,
    public phone: string,
    public email: string,
  ) {}
}
