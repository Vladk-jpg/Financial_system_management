import { UserRole } from "./user";

export class Profile {
  public role: UserRole = UserRole.CLIENT;
  constructor(
    public fullName: string,
    public passportNumber: string,
    public identificationNumber: string,
    public phone: string,
    public email: string
  ) {}
}
