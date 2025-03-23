import { Loan } from 'src/domain/entities/loan';
import { LoanModel } from '../models/loan.model';

export class LoanMapper {
  static toDomain(model: LoanModel): Loan {
    const loan = new Loan(
      model.amount,
      model.bank.id,
      model.status,
      model.accountIBAN,
      model.accountType,
      model.interestRate,
      model.termMonths,
      model.remainingBalance,
      model.issueDate,
    );
    loan.id = model.id;
    return loan;
  }

  static toModel(entity: Loan): LoanModel {
    const loan = new LoanModel();
    loan.accountIBAN = entity.accountIBAN;
    loan.accountType = entity.accountType;
    loan.amount = entity.amount;
    loan.id = entity.id;
    loan.interestRate = entity.interestRate;
    loan.issueDate = entity.issueDate;
    loan.remainingBalance = entity.remainingBalance;
    loan.status = entity.status;
    loan.termMonths = entity.termMonths;
    return loan;
  }
}
