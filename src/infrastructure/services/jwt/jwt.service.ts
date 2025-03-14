import { Injectable } from '@nestjs/common';
import { IJwtService } from 'src/domain/adapters/jwt.interface';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService implements IJwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  sign(payload: any): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string): any {
    return this.jwtService.verify(token);
  }
}
