import { Module } from '@nestjs/common';
import { IBANgenerator } from './iban-gen.service';

@Module({
  providers: [IBANgenerator],
  exports: [IBANgenerator],
})
export class IBANModule {}
