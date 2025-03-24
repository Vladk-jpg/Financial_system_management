import { ILoanRepository } from 'src/domain/repositories/loan.repository';
import { CreateLoanDTO } from '../dto/create-loan.dto';
import { ParticipantType } from 'src/domain/entities/transaction';
import { Loan, LoanSatus } from 'src/domain/entities/loan';
import { IException } from 'src/domain/interfaces/exceptions.interface';
import { IAccountRepository } from 'src/domain/repositories/account.repository';
import { IEAccountRepository } from 'src/domain/repositories/e-account.repository';
import { AccountState } from 'src/domain/entities/account';
import { IUnitOfWork } from 'src/domain/interfaces/unit-of-work.interface';
import { ILoanService } from '../interfaces/loan.interface';

export class LoanService implements ILoanService {
  constructor(
    private readonly loanRepo: ILoanRepository,
    private readonly accountRepo: IAccountRepository,
    private readonly eaccountRepo: IEAccountRepository,
    private readonly exception: IException,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async createLoan(dto: CreateLoanDTO): Promise<Loan | null> {
    const type =
      dto.accountIBAN[18] == 'U'
        ? ParticipantType.ACCOUNT
        : ParticipantType.ENTERPRISE;
    const remainingBalance = Math.floor(dto.amount * (1 + dto.interestRate / 100));
    const issueDate = new Date();

    const repo =
      dto.accountIBAN[18] == 'U' ? this.accountRepo : this.eaccountRepo;
    const account = await repo.findByIBAN(dto.accountIBAN);

    if (!account || account.state != AccountState.ACTIVE) {
      this.exception.NotFoundException({ message: 'account not found' });
      return null;
    }

    const loan = new Loan(
      dto.amount,
      account.bank,
      LoanSatus.PENDING,
      dto.accountIBAN,
      type,
      dto.interestRate,
      dto.termMonths,
      remainingBalance,
      issueDate,
    );
    const saved = await this.loanRepo.create(loan);
    return saved;
  }

  async activateLoan(id: number): Promise<void> {
    await this.unitOfWork.begin();
    const manager = this.unitOfWork.getManager<any>();
    try {
      const loan = await this.loanRepo.findById(id);
      if (!loan || loan.status != LoanSatus.PENDING) {
        this.exception.NotFoundException({ message: 'Loan not found' });
        throw new Error();
      }
      loan.status = LoanSatus.ACTIVE;
      loan.issueDate = new Date();
      const repo =
        loan.accountIBAN[18] == 'U' ? this.accountRepo : this.eaccountRepo;
      const account = await repo.findByIBAN(loan.accountIBAN);

      if (!account || account.state != AccountState.ACTIVE) {
        this.exception.NotFoundException({ message: 'account not found' });
        throw new Error();
      }

      await repo.deposit(account.id, loan.amount, manager);

      await this.loanRepo.update(loan);
      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  async cancelLoan(id: number): Promise<void> {
    const loan = await this.loanRepo.findById(id);
    if (!loan || loan.status != LoanSatus.PENDING) {
      this.exception.NotFoundException({
        message: 'Loan not found or you can not cancel it',
      });
      throw new Error();
    }
    loan.status = LoanSatus.CANCELED;
    loan.issueDate = new Date();
    await this.loanRepo.update(loan);
  }

  async getLoanById(id: number): Promise<Loan | null> {
    const loan = await this.loanRepo.findById(id);
    return loan;
  }

  async getLoansByAccountIBAN(iban: string): Promise<Loan[]> {
    const loans = this.loanRepo.findByAccountIBAN(iban);
    return loans;
  }

  async getLoansByBankId(id: number): Promise<Loan[]> {
    const loans = this.loanRepo.findByBankId(id);
    return loans;
  }

  async repayLoan(id: number, amount: number): Promise<void> {
    await this.unitOfWork.begin();
    const manager = this.unitOfWork.getManager<any>();
    try {
      const loan = await this.loanRepo.findById(id);
      if (!loan || loan.status != LoanSatus.ACTIVE) {
        this.exception.NotFoundException({
          message: 'Loan with such id not found',
        });
        throw new Error();
      }

      const repo =
        loan.accountIBAN[18] == 'U' ? this.accountRepo : this.eaccountRepo;

      const account = await repo.findByIBAN(loan.accountIBAN);
      if (!account || account.state != AccountState.ACTIVE) {
        this.exception.NotFoundException({ message: 'Account not found' });
        throw new Error();
      }

      const isWithdrawn = await repo.withdraw(account.id, amount, manager);
      if (!isWithdrawn) {
        throw new Error('Failure to withdraw money');
      }

      const isRepaied = await this.loanRepo.repay(id, amount, manager);
      if (!isRepaied) {
        this.exception.badRequestException({ message: "Can't to repay" });
      }
      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  async deleteLoan(id: number): Promise<void> {
    const loan = await this.loanRepo.findById(id);
    if (!loan) {
      this.exception.NotFoundException({ message: 'loan not found' });
    }
    await this.loanRepo.delete(id);
  }
}
