import { IUnitOfWork } from 'src/domain/interfaces/unit-of-work.interface';
import { IAccountRepository } from 'src/domain/repositories/account.repository';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';
import { CreateTransactionDTO } from '../dto/create-transaction.dto';
import { ParticipantType, Transaction } from 'src/domain/entities/transaction';

export class TransactionService {
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly accountRepository: IAccountRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async transferFunds(dto: CreateTransactionDTO): Promise<void> {
    await this.unitOfWork.begin();
    const manager = this.unitOfWork.getManager<any>();

    try {
      const fromAccount = await this.accountRepository.findByIBAN(
        dto.senderIBAN,
        manager,
      );
      const toAccount = await this.accountRepository.findByIBAN(
        dto.recipientIBAN,
        manager,
      );

      if (!fromAccount || !toAccount) {
        throw new Error('One of the accounts does not exist');
      }

      if (fromAccount.balance < dto.amount) {
        throw new Error('Not enough money');
      }

      const isWithdrawn = await this.accountRepository.withdraw(
        fromAccount.id,
        dto.amount,
        manager,
      );
      if (!isWithdrawn) {
        throw new Error('Failure to withdraw money');
      }

      await this.accountRepository.deposit(toAccount.id, dto.amount, manager);

      const transaction = new Transaction(
        ParticipantType.ACCOUNT,
        fromAccount.id,
        ParticipantType.ACCOUNT,
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
}
