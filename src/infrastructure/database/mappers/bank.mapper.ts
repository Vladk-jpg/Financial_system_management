import { Bank } from 'src/domain/entities/bank';
import { BankEntity } from '../entities/bank.entity';

export class BankMapper {
  static toDomain(entity: BankEntity): Bank {
    return new Bank(entity.name, entity.bic, entity.address);
  }

  static toEntity(domain: Bank): BankEntity {
    const entity = new BankEntity();
    entity.name = domain.name;
    entity.bic = domain.bic;
    entity.address = domain.address;
    return entity;
  }
}
