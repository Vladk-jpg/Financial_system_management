import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
  Get,
  Patch,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { TransactionService } from 'src/application/services/transaction.service';
import { ServiceProxyModule } from '../service-proxy/service-proxy.module';
import { ServiceProxy } from '../service-proxy/service-proxy';
import { CreateTransactionDTO } from 'src/application/dto/create-transaction.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from 'src/domain/entities/user';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TransactionController {
  private readonly transactionService: TransactionService;

  constructor(
    @Inject(ServiceProxyModule.TRANSACTION_SERVICE_PROXY)
    private readonly transactionServiceProxy: ServiceProxy<TransactionService>,
  ) {
    this.transactionService = transactionServiceProxy.getInstance();
  }

  @Post('transfer')
  async transferFunds(@Body() dto: CreateTransactionDTO) {
    await this.transactionService.transferFunds(dto);
    return { message: 'TransferCompleted' };
  }

  @Roles(UserRole.OPERATOR, UserRole.MANAGER, UserRole.ADMIN)
  @Patch('cancel/:id')
  async cancelTransaction(@Param('id') id: number) {
    const transaction = await this.transactionService.cancelTransaction(id);
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  @Roles(UserRole.OPERATOR, UserRole.MANAGER, UserRole.ADMIN)
  @Get(':id')
  async getTransactionById(@Param('id') id: number) {
    const transaction = await this.transactionService.getTransactionById(id);
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  @Get('account')
  async getTransactionsByAccountIBAN(@Query('IBAN') iban: string) {
    const transactions =
      await this.transactionService.getTransactionsByAccountIBAN(iban);
    return transactions;
  }

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN)
  @Post('salary/:enterId')
  async sendSalary(
    @Body('IBAN') iban: string,
    @Param('enterId') enterId: number,
  ) {
    await this.transactionService.sendSalary(enterId, iban);
  }
}
