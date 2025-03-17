export interface IIBANgenerator {
  generateIBAN(bankId: number, userId: number): Promise<string>;
}
