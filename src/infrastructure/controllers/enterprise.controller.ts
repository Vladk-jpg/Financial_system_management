import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
  NotFoundException,
  Get,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { ServiceProxyModule } from '../service-proxy/service-proxy.module';
import { EnterpriseService } from 'src/application/services/enterprise.service';
import { ServiceProxy } from '../service-proxy/service-proxy';
import { createEnterpriseDTO } from 'src/application/dto/create-enterprise.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from 'src/domain/entities/user';

@Controller('enterprise')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EnterpriseController {
  private readonly enterService: EnterpriseService;

  constructor(
    @Inject(ServiceProxyModule.ENTERPRISE_SERVICE_PROXY)
    private readonly enterServiceProxy: ServiceProxy<EnterpriseService>,
  ) {
    this.enterService = enterServiceProxy.getInstance();
  }

  @Post('create')
  async createEnterprise(
    @Body() dto: createEnterpriseDTO,
    @Request() req: any,
  ) {
    dto.isBank = false;
    const enterprise = await this.enterService.createEnterprise(
      dto,
      req.user.id,
    );
    return enterprise;
  }

  @Roles(UserRole.ADMIN)
  @Post('admin/create')
  async createEnterpriseAdmin(
    @Body() dto: createEnterpriseDTO,
    @Request() req: any,
  ) {
    const enterprise = await this.enterService.createEnterprise(
      dto,
      req.user.id,
    );
    return enterprise;
  }

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN)
  @Get(':id')
  async getEnterpriseById(@Param('id') id: number) {
    const enterprise = await this.enterService.getById(id);
    return enterprise;
  }

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN)
  @Get('user')
  async getEnterprisesByUserId(@Request() req: any) {
    const enterprises = await this.enterService.getAllByUserId(req.user.id);
    return enterprises;
  }

  @Roles(UserRole.ADMIN)
  @Get('bic')
  async getEnterprisesByBic(@Query('bic') bic: string) {
    const enterprises = await this.enterService.getAllByBic(bic);
    return enterprises;
  }

  @Roles(UserRole.ENTERPRISE_SPECIALIST, UserRole.ADMIN)
  @Delete(':id')
  async deleteEnterprise(@Param('id') id: number) {
    const enterprise = await this.enterService.getById(id);
    if (!enterprise) throw new NotFoundException('Enterprise with such id not found');
  }

}
