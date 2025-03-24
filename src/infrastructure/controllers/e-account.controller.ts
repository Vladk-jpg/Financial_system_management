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
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from 'src/domain/entities/user';

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

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN, UserRole.MANAGER)
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

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN, UserRole.MANAGER)
  @Get(':id')
  async getEAccountById(@Param('id') id: number) {
    const eaccount = await this.eaccountService.findById(id);
    if (!eaccount)
      throw new NotFoundException('Enterprise account with such id not found');
    return eaccount;
  }

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN, UserRole.MANAGER)
  @Get('enterprise/:enterpriseId')
  async getAllAccountsByEnterpriseId(@Param('enterpriseId') enterId: number) {
    const eaccounts = await this.eaccountService.findAllByEnterpriseId(enterId);
    return eaccounts;
  }

  @Roles(UserRole.MANAGER)
  @Patch('freeze/:id')
  async freezeEAccount(@Param('id') id: number) {
    const eaccount = await this.eaccountService.freezeEAccount(id);
    if (!eaccount)
      throw new NotFoundException('Enterprise account with such id not found');
    return eaccount;
  }

  @Roles(UserRole.MANAGER)
  @Patch('block/:id')
  async blockEAccount(@Param('id') id: number) {
    const eaccount = await this.eaccountService.blockEAccount(id);
    if (!eaccount)
      throw new NotFoundException('Enterprise account with such id not found');
    return eaccount;
  }

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN)
  @Delete(':id')
  async deleteEAccount(@Param('id') id: number) {
    const eaccount = await this.eaccountService.findById(id);
    if (!eaccount)
      throw new NotFoundException('Enterprise account with such id not found');
    await this.eaccountService.deleteEAccount(id);
  }
}
