import { IUnitOfWork } from 'src/domain/interfaces/unit-of-work.interface';
import { IAccountRepository } from 'src/domain/repositories/account.repository';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';
import { CreateTransactionDTO } from '../dto/create-transaction.dto';
import { ParticipantType, Transaction } from 'src/domain/entities/transaction';
import { AccountState } from 'src/domain/entities/account';
import { OperationState } from 'src/domain/enums/operation-state.enum';
import { IEAccountRepository } from 'src/domain/repositories/e-account.repository';

export class TransactionService {
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly accountRepository: IAccountRepository,
    private readonly eaccountRepository: IEAccountRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async transferFunds(dto: CreateTransactionDTO): Promise<void> {
    await this.unitOfWork.begin();
    const manager = this.unitOfWork.getManager<any>();

    try {
      const senderRepo =
        dto.senderType == ParticipantType.ACCOUNT
          ? this.accountRepository
          : this.eaccountRepository;
      const recipientRepo =
        dto.recipientType == ParticipantType.ACCOUNT
          ? this.accountRepository
          : this.eaccountRepository;

      const fromAccount = await senderRepo.findByIBAN(
        dto.senderIBAN,
        manager,
      );
      const toAccount = await recipientRepo.findByIBAN(
        dto.recipientIBAN,
        manager,
      );

      if (!fromAccount || !toAccount) {
        throw new Error('One of the accounts does not exist');
      }

      if (
        !(fromAccount.state == AccountState.ACTIVE) ||
        !(toAccount.state == AccountState.ACTIVE)
      ) {
        throw new Error('One of the accounts is blocked/frozen');
      }

      if (fromAccount.balance < dto.amount) {
        throw new Error('Not enough money');
      }

      const isWithdrawn = await senderRepo.withdraw(
        fromAccount.id,
        dto.amount,
        manager,
      );
      if (!isWithdrawn) {
        throw new Error('Failure to withdraw money');
      }

      await recipientRepo.deposit(toAccount.id, dto.amount, manager);

      const transaction = new Transaction(
        dto.senderType,
        fromAccount.id,
        dto.recipientType,
        toAccount.id,
        dto.amount,
      );

      await this.transactionRepository.createTransaction(transaction);
      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    const transaction = await this.transactionRepository.getTransactionById(id);
    return transaction;
  }

  async cancelTransaction(id: number): Promise<Transaction | null> {
    await this.unitOfWork.begin();
    const manager = this.unitOfWork.getManager<any>();
    const transaction = await this.transactionRepository.getTransactionById(id);
    if (!transaction) return null;
    if (transaction.state == OperationState.CANCELED) return null;

    try {
      const senderRepo =
        transaction.senderType == ParticipantType.ACCOUNT
          ? this.accountRepository
          : this.eaccountRepository;
      const recipientRepo =
        transaction.recipientType == ParticipantType.ACCOUNT
          ? this.accountRepository
          : this.eaccountRepository;

      const fromAccount = await senderRepo.findById(
        transaction.senderId,
        manager,
      );
      const toAccount = await recipientRepo.findById(
        transaction.recipientId,
        manager,
      );

      if (!fromAccount || !toAccount) {
        throw new Error('One of the accounts does not exist');
      }

      const isWithdrawn = await recipientRepo.withdraw(
        toAccount.id,
        transaction.amount,
        manager,
      );
      if (!isWithdrawn) {
        throw new Error('Failure to withdraw money');
      }

      await senderRepo.deposit(
        fromAccount.id,
        transaction.amount,
        manager,
      );

      const newTransaction = new Transaction(
        transaction.recipientType,
        toAccount.id,
        transaction.senderType,
        fromAccount.id,
        transaction.amount,
      );
      await this.transactionRepository.createTransaction(newTransaction);
      await this.transactionRepository.cancelTransaction(transaction.id);
      await this.unitOfWork.commit();
      return newTransaction;
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  async getTransactionsByAccountIBAN(iban: string): Promise<Transaction[]> {
    const repo = iban[18] == 'U' ? this.accountRepository : this.eaccountRepository;
    const account = await repo.findByIBAN(iban);
    var transactions: Transaction[] = [];
    if (!account) return transactions;
    transactions = await this.transactionRepository.getTransactionsByAccountId(
      account.id,
    );
    return transactions;
  }
}
