import { IUnitOfWork } from 'src/domain/interfaces/unit-of-work.interface';
import { IAccountRepository } from 'src/domain/repositories/account.repository';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';
import { CreateTransactionDTO } from '../dto/create-transaction.dto';
import { ParticipantType, Transaction } from 'src/domain/entities/transaction';
import { AccountState } from 'src/domain/entities/account';
import { OperationState } from 'src/domain/enums/operation-state.enum';
import { IEAccountRepository } from 'src/domain/repositories/e-account.repository';
import { ISalaryProjectRepository } from 'src/domain/repositories/salary-project.repository';
import { IEnterpriseRepository } from 'src/domain/repositories/enterprise.repository';
import { IException } from 'src/domain/interfaces/exceptions.interface';
import { EAccount } from 'src/domain/entities/e-account';
import { ILogger } from 'src/domain/logger/logger.interface';
import { ITransactionService } from '../interfaces/transaction.interface';

export class TransactionService implements ITransactionService {
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly accountRepository: IAccountRepository,
    private readonly eaccountRepository: IEAccountRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly sProjectRepo: ISalaryProjectRepository,
    private readonly exception: IException,
    private readonly logger: ILogger,
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

      const fromAccount = await senderRepo.findByIBAN(dto.senderIBAN, manager);
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

      await senderRepo.deposit(fromAccount.id, transaction.amount, manager);

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
    const repo =
      iban[18] == 'U' ? this.accountRepository : this.eaccountRepository;
    const account = await repo.findByIBAN(iban);
    var transactions: Transaction[] = [];
    if (!account) return transactions;
    transactions = await this.transactionRepository.getTransactionsByAccountId(
      account.id,
    );
    return transactions;
  }

  async sendSalary(enterpriseId: number, IBAN: string): Promise<void> {
    const eaccounts =
      await this.eaccountRepository.findAllByEnterpriseId(enterpriseId);
    var was = false;
    for (const eacc of eaccounts) {
      if (eacc.IBAN == IBAN) {
        was = true;
        break;
      }
    }
    if (!was)
      this.exception.NotFoundException({
        message: 'Enterprise account not found',
      });

    const salaryProject =
      await this.sProjectRepo.findByEnterpriseId(enterpriseId);

    if (!salaryProject || !salaryProject.isActive) {
      this.exception.NotFoundException({
        message: 'Enterprise does not have salary project',
      });
    } else {
      const employees = await this.sProjectRepo.findAllEmployees(
        salaryProject.id,
      );
      var total = 0;
      for (const empl of employees) {
        total += empl.salary;
      }
      const eaccount = await this.eaccountRepository.findByIBAN(IBAN);
      if (!eaccount) throw new Error(); //this exception will never use, created only for remove null reference
      if (total > eaccount.balance) {
        this.exception.forbiddenException({
          message: 'Not enough money for transfer',
        });
      }

      //Start of transfer
      for (const employee of employees) {
        const dto = new CreateTransactionDTO(
          IBAN,
          ParticipantType.ENTERPRISE,
          employee.IBAN,
          ParticipantType.ACCOUNT,
          employee.salary,
        );
        try {
          await this.transferFunds(dto);
        } catch (error) {
          this.logger.error(`IBAN: ${employee.IBAN}. ${error}`);
        }
      }
    }
  }
}
