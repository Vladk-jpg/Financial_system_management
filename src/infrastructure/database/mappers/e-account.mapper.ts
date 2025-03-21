import { EAccount } from 'src/domain/entities/e-account';
import { EAccountModel } from '../models/e-account.model';

export class EAccountMapper {
  static toDomain(model: EAccountModel): EAccount {
    const entity = new EAccount(model.IBAN, model.bank.id, model.enterprise.id);
    entity.balance = model.balance;
    entity.id = model.id;
    entity.state = model.state;
    return entity;
  }
}
