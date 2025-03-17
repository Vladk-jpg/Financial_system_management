import { IIBANgenerator } from 'src/domain/interfaces/iban-gen.interface';

export class IBANgenerator implements IIBANgenerator {
  async generateIBAN(bankId: number, userId: number): Promise<string> {
    const countryCode = 'BY'; 
    const checkDigits = Math.floor(10 + Math.random() * 90); 
    const bankPart = String(bankId).padStart(4, '0'); 
    const userPart = String(userId).padStart(11, '0'); 
    return `${countryCode}${checkDigits}${bankPart}${userPart}`;
  }
}
