import { Bank } from 'src/domain/entities/bank';
import { BankModel } from '../models/bank.model';

export class BankMapper {
  static toDomain(entity: BankModel): Bank {
    return new Bank(entity.name, entity.bic, entity.address);
  }

  static toModel(domain: Bank): BankModel {
    const entity = new BankModel();
    entity.name = domain.name;
    entity.bic = domain.bic;
    entity.address = domain.address;
    return entity;
  }
}
