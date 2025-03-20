import { Enterprise } from 'src/domain/entities/enterprise';
import { EnterpriseModel } from '../models/enterprise.model';

export class EnterpriseMapper {
  static toDomain(model: EnterpriseModel): Enterprise {
    const entity = new Enterprise(
      model.name,
      model.type,
      model.unp,
      model.bic,
      model.address,
    );
    entity.id = model.id;
    return entity;
  }
  static toModel(entity: Enterprise): EnterpriseModel {
    const model = new EnterpriseModel();
    model.address = entity.address;
    model.bic = entity.bic;
    model.id = entity.id;
    model.name = entity.name;
    model.type = entity.type;
    model.unp = entity.unp;
    return model;
  }
}
