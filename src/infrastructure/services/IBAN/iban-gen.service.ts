import { IIBANgenerator } from 'src/domain/interfaces/iban-gen.interface';

export class IBANgenerator implements IIBANgenerator {
  async generateIBANforAccount(bankId: number, userId: number): Promise<string> {
    const countryCode = 'BY'; 
    const checkDigits = Math.floor(10 + Math.random() * 90); 
    const bankPart = String(bankId).padStart(4, '0'); 
    const userPart = String(userId).padStart(10, '0'); 
    return `${countryCode}${checkDigits}${bankPart}${userPart}U`;
  }
  async generateIBANforEAccount(bankId: number, enterpriseId: number): Promise<string> {
    const countryCode = 'BY'; 
    const checkDigits = Math.floor(10 + Math.random() * 90); 
    const bankPart = String(bankId).padStart(4, '0'); 
    const userPart = String(enterpriseId).padStart(10, '0'); 
    return `${countryCode}${checkDigits}${bankPart}${userPart}E`;
  }
}
