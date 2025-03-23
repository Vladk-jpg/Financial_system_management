import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { ServiceProxyModule } from '../service-proxy/service-proxy.module';
import { ServiceProxy } from '../service-proxy/service-proxy';
import { GetLogsUseCase } from 'src/application/use-cases/get-logs.use-case';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from 'src/domain/entities/user';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  constructor(
    @Inject(ServiceProxyModule.GET_LOGS_USECASE_PROXY)
    private readonly getLogsUseCase: ServiceProxy<GetLogsUseCase>,
  ) {}

  @Roles(UserRole.ADMIN)
  @Get('logs')
  async getLogs() {
    const logs = await this.getLogsUseCase.getInstance().execute();
    return { logs: logs };
  }
}
