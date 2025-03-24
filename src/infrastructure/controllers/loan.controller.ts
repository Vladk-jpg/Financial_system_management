import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { LoanService } from 'src/application/services/loan.service';
import { ServiceProxyModule } from '../service-proxy/service-proxy.module';
import { ServiceProxy } from '../service-proxy/service-proxy';
import { CreateLoanDTO } from 'src/application/dto/create-loan.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from 'src/domain/entities/user';

@Controller('loan')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LoanController {
  private readonly loanService: LoanService;

  constructor(
    @Inject(ServiceProxyModule.LOAN_SERVICE_PROXY)
    private readonly loanServiceProxy: ServiceProxy<LoanService>,
  ) {
    this.loanService = loanServiceProxy.getInstance();
  }

  @Post('create')
  async createLoan(@Body() dto: CreateLoanDTO) {
    const loan = await this.loanService.createLoan(dto);
    return loan;
  }

  @Roles(UserRole.MANAGER)
  @Patch('activate/:id')
  async activateLoan(@Param('id') id: number) {
    await this.loanService.activateLoan(id);
    return { message: 'Loan successfuly activated' };
  }

  @Roles(UserRole.MANAGER)
  @Patch('cancel/:id')
  async cancelLoan(@Param('id') id: number) {
    await this.loanService.cancelLoan(id);
    return { message: 'Loan successfuly canceled' };
  }

  @Get(':id')
  async getLoanById(@Param('id') id: number) {
    const loans = await this.loanService.getLoanById(id);
    return loans;
  }

  @Get('by-iban')
  async getLoansByAccountIBAN(@Query('iban') iban: string) {
    const loans = await this.loanService.getLoansByAccountIBAN(iban);
    return loans;
  }

  @Roles(UserRole.ADMIN)
  @Get('bank/:id')
  async getLoansByBankId(@Param('id') id: number) {
    const loans = await this.loanService.getLoansByBankId(id);
    return loans;
  }

  @Post('repay/:id')
  async repayLoan(@Body('amount') amount: number, @Param('id') id: number) {
    await this.loanService.repayLoan(id, amount);
    return { message: 'Loan successfuly repayed' };
  }
}
