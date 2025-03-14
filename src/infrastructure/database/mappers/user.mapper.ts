import { User } from 'src/domain/entities/user';
import { UserModel } from '../models/user.model';

export class UserMapper {
  static toDomain(model: UserModel) : User {
    const entity = new User(
      model.fullName,
      model.passportNumber,
      model.identificationNumber,
      model.phone,
      model.email,
      model.passwordHash,
      model.isForeign,
    );
    entity.id = model.id;
    entity.isActive = model.isActive;
    entity.role = model.role;
    return entity;
  }

  static toModel(entity: User) : UserModel {
    const model = new UserModel();
    model.email = entity.email;
    model.fullName = entity.fullName;
    model.id = entity.id;
    model.identificationNumber = entity.identificationNumber;
    model.isActive = entity.isActive;
    model.isForeign = entity.isForeign;
    model.passportNumber = entity.passportNumber;
    model.passwordHash = entity.passwordHash;
    model.phone = entity.phone;
    model.role = entity.role;
    return model;
  }
}
