import { InjectRepository } from '@nestjs/typeorm';
import { Loan, LoanSatus } from 'src/domain/entities/loan';
import { ILoanRepository } from 'src/domain/repositories/loan.repository';
import { LoanMapper } from '../mappers/loan.mapper';
import { LoanModel } from '../models/loan.model';
import { EntityManager, Repository } from 'typeorm';
import { BankModel } from '../models/bank.model';
import { NotFoundException } from '@nestjs/common';

export class LoanRepository implements ILoanRepository {
  constructor(
    @InjectRepository(LoanModel)
    private readonly loanRepo: Repository<LoanModel>,
    @InjectRepository(BankModel)
    private readonly bankRepo: Repository<BankModel>,
  ) {}

  async getAllPending(): Promise<Loan[]> {
    const loans = await this.loanRepo.find({
      where: { status: LoanSatus.PENDING },
      relations: ['bank'],
    });
    return loans.map(LoanMapper.toDomain);
  }

  async create(loan: Loan): Promise<Loan> {
    const loanModel = LoanMapper.toModel(loan);
    const bank = await this.bankRepo.findOne({ where: { id: loan.bankId } });
    if (!bank) throw new NotFoundException('Bank not found');
    loanModel.bank = bank;
    const saved = await this.loanRepo.save(loanModel);
    return LoanMapper.toDomain(saved);
  }

  async findById(id: number, manager?: EntityManager): Promise<Loan | null> {
    const repo = manager ? manager.getRepository(LoanModel) : this.loanRepo;
    const loan = await repo.findOne({ where: { id: id }, relations: ['bank'] });
    return loan ? LoanMapper.toDomain(loan) : null;
  }

  async findByAccountIBAN(iban: string): Promise<Loan[]> {
    const loans = await this.loanRepo.find({
      where: { accountIBAN: iban },
      relations: ['bank'],
    });
    return loans.map(LoanMapper.toDomain);
  }

  async findByBankId(id: number): Promise<Loan[]> {
    const loans = await this.loanRepo.find({
      where: { bank: { id: id } },
      relations: ['bank'],
    });
    return loans.map(LoanMapper.toDomain);
  }

  async update(loan: Loan): Promise<Loan> {
    const model = LoanMapper.toModel(loan);
    await this.loanRepo.update(model.id, model);
    return loan;
  }

  async delete(id: number): Promise<void> {
    await this.loanRepo.delete(id);
  }

  async repay(
    id: number,
    amount: number,
    manager: EntityManager,
  ): Promise<Boolean> {
    const repo = manager.getRepository(LoanModel);
    const loan = await this.findById(id);
    if (!loan) {
      return false;
    }
    await repo.decrement({ id }, 'remainingBalance', amount);
    const updatedLoan = await this.findById(id);
    if (!updatedLoan) {
      return false;
    }
    if (updatedLoan.remainingBalance <= 0) {
      await repo.update(loan.id, { status: LoanSatus.PAID_OFF });
    }
    return true;
  }
}
