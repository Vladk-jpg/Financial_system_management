import {
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
  Param,
  NotFoundException,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { AccountService } from 'src/application/services/account.service';
import { ServiceProxyModule } from '../service-proxy/service-proxy.module';
import { ServiceProxy } from '../service-proxy/service-proxy';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('account')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AccountController {
  private readonly accountService: AccountService;

  constructor(
    @Inject(ServiceProxyModule.ACCOUNT_SERVICE_PROXY)
    private readonly accountServiceProxy: ServiceProxy<AccountService>,
  ) {
    this.accountService = accountServiceProxy.getInstance();
  }

  @Post(':bankId')
  async createAccount(@Request() req: any, @Param('bankId') bankId: number) {
    const account = await this.accountService.createAccount(
      bankId,
      req.user.id,
    );
    if (!account) throw new NotFoundException('Bank with such id not found');
    return account;
  }

  @Get(':id')
  async getAccountById(@Param('id') id: number) {
    const account = await this.accountService.findById(id);
    if (!account) throw new NotFoundException('Account with such id not found');
    return account;
  }

  @Get()
  async getAllAccountsByUserId(@Request() req: any) {
    const accounts = await this.accountService.findAllByUserId(req.user.id);
    return accounts;
  }

  @Patch('freeze/:id')
  async freezeAccount(@Param('id') id: number) {
    const account = await this.accountService.freezeAccount(id);
    if (!account) throw new NotFoundException('Account with such id not found');
    return account;
  }

  @Patch('block/:id')
  async blockAccount(@Param('id') id: number) {
    const account = await this.accountService.blockAccount(id);
    if (!account) throw new NotFoundException('Account with such id not found');
    return account;
  }

  @Delete(':id')
  async deleteAccount(@Param('id') id: number) {
    const account = await this.accountService.findById(id);
    if (!account) throw new NotFoundException('Account with such id not found');
    await this.accountService.deleteAccount(id);
  }
}
