import { Transaction } from 'src/domain/entities/transaction';
import { TransactionModel } from '../models/transaction.model';

export class TransactionMapper {
  static toDomain(model: TransactionModel): Transaction {
    const entity = new Transaction(
      model.senderType,
      model.senderId,
      model.recipientType,
      model.recipientId,
      model.amount,
    );
    entity.id = model.id;
    entity.state = model.state;
    entity.createdAt = model.createdAt;
    return entity;
  }

  static toModel(entity: Transaction): TransactionModel {
    const model = new TransactionModel();
    model.id = entity.id;
    model.amount = entity.amount;
    model.recipientId = entity.recipientId;
    model.senderId = entity.senderId;
    model.state = entity.state;
    model.senderType = entity.senderType;
    model.recipientType = entity.recipientType;
    model.createdAt = entity.createdAt;
    return model;
  }
}
