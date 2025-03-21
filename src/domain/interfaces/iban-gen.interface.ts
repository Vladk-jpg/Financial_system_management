export interface IIBANgenerator {
  generateIBANforAccount(bankId: number, userId: number): Promise<string>;
  generateIBANforEAccount(bankId: number, enterpriseId: number): Promise<string>;
}
