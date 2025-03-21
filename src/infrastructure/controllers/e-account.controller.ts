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
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { EAccountService } from 'src/application/services/e-account.service';
import { ServiceProxyModule } from '../service-proxy/service-proxy.module';
import { ServiceProxy } from '../service-proxy/service-proxy';

@Controller('eaccount')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EAccountController {
  private readonly eaccountService: EAccountService;

  constructor(
    @Inject(ServiceProxyModule.EACCOUNT_SERVICE_PROXY)
    private readonly eaccountServiceProxy: ServiceProxy<EAccountService>,
  ) {
    this.eaccountService = eaccountServiceProxy.getInstance();
  }

  @Post(':enterId')
  async createEAccount(@Param('enterId') enterId: number, @Request() req: any) {
    const eaccount = await this.eaccountService.createEAccount(
      enterId,
      req.user.id,
    );
    if (!eaccount)
      throw new NotFoundException('Enterprise with such id not found');
    return eaccount;
  }

  @Get(':id')
  async getEAccountById(@Param('id') id: number) {
    const eaccount = await this.eaccountService.findById(id);
    if (!eaccount)
      throw new NotFoundException('Enterprise account with such id not found');
    return eaccount;
  }

  @Get('enterprise/:enterpriseId')
  async getAllAccountsByEnterpriseId(@Param('enterpriseId') enterId: number) {
    const eaccounts = await this.eaccountService.findAllByEnterpriseId(enterId);
    return eaccounts;
  }

  @Patch('freeze/:id')
  async freezeEAccount(@Param('id') id: number) {
    const eaccount = await this.eaccountService.freezeEAccount(id);
    if (!eaccount)
      throw new NotFoundException('Enterprise account with such id not found');
    return eaccount;
  }

  @Patch('block/:id')
  async blockEAccount(@Param('id') id: number) {
    const eaccount = await this.eaccountService.blockEAccount(id);
    if (!eaccount)
      throw new NotFoundException('Enterprise account with such id not found');
    return eaccount;
  }

  @Delete(':id')
  async deleteEAccount(@Param('id') id: number) {
    const eaccount = await this.eaccountService.findById(id);
    if (!eaccount)
      throw new NotFoundException('Enterprise account with such id not found');
    await this.eaccountService.deleteEAccount(id);
  }
}
