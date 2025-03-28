import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParticipantType, Transaction } from 'src/domain/entities/transaction';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';
import { TransactionModel } from '../models/transaction.model';
import { MoreThan, Repository } from 'typeorm';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { OperationState } from 'src/domain/enums/operation-state.enum';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionModel)
    private readonly transactionRepo: Repository<TransactionModel>,
  ) {}

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    const model = TransactionMapper.toModel(transaction);
    const saved = await this.transactionRepo.save(model);
    return TransactionMapper.toDomain(saved);
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    const transaction = await this.transactionRepo.findOne({
      where: { id: id },
    });
    if (!transaction) return null;
    return TransactionMapper.toDomain(transaction);
  }

  async getTransactionsByAccountId(
    id: number,
    type: ParticipantType,
  ): Promise<Transaction[]> {
    const transactions = await this.transactionRepo.find({
      where: [
        { senderId: id, senderType: type },
        { recipientId: id, recipientType: type },
      ],
    });
    return transactions.map(TransactionMapper.toDomain);
  }

  async cancelTransaction(id: number): Promise<Transaction | null> {
    const transaction = await this.transactionRepo.findOne({
      where: { id: id },
    });
    if (!transaction) return null;
    transaction.state = OperationState.CANCELED;
    transaction.createdAt;
    await this.transactionRepo.update(id, transaction);
    return TransactionMapper.toDomain(transaction);
  }

  async getLatestTransactions(): Promise<Transaction[]> {
    const past24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const transactions = await this.transactionRepo.find({
      where: {
        createdAt: MoreThan(past24Hours),
      },
    });
    return transactions;
  }
}
