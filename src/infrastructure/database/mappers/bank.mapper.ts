import { Bank } from 'src/domain/entities/bank';
import { BankModel } from '../models/bank.model';

export class BankMapper {
  static toDomain(model: BankModel): Bank {
    const bank = new Bank(model.name, model.bic, model.address);
    bank.id = model.id;
    return bank;
  }

  static toModel(domain: Bank): BankModel {
    const model = new BankModel();
    model.id = domain.id;
    model.name = domain.name;
    model.bic = domain.bic;
    model.address = domain.address;
    return model;
  }
}
