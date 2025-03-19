import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { TransactionService } from 'src/application/services/transaction.service';
import { ServiceProxyModule } from '../service-proxy/service-proxy.module';
import { ServiceProxy } from '../service-proxy/service-proxy';
import { CreateTransactionDTO } from 'src/application/dto/create-transaction.dto';

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

  @Post('account/transfer')
  async transferFunds(@Body() dto: CreateTransactionDTO) {
    await this.transactionService.transferFunds(dto);
    return { message: 'TransferCompleted' };
  }
}
