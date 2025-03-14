import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IBcryptService } from 'src/domain/adapters/bcrypt.interfase';

@Injectable()
export class BcryptService implements IBcryptService {
  rounds: number = 10;

  KEYWORD: string = "bombardiro crocodilo";

  async hash(hashString: string): Promise<string> {
    return await bcrypt.hash(this.KEYWORD + hashString, this.rounds);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(this.KEYWORD + password, hashPassword);
  }
}