import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Delete,
  Param,
  Inject,
} from '@nestjs/common';
import { CreateBankDTO } from 'src/application/dto/create-bank.dto';
import { BankService } from 'src/application/services/bank.service';
import { UpdateBankDTO } from 'src/application/dto/update-bank.dto';
import { ServiceProxyModule } from 'src/infrastructure/service-proxy/service-proxy.module';
import { ServiceProxy } from 'src/infrastructure/service-proxy/service-proxy';

@Controller('banks')
export class BankController {
  constructor(
    @Inject(ServiceProxyModule.BANK_SERVICE_PROXY)
    private readonly bankService: ServiceProxy<BankService>,
  ) {}

  @Post('create')
  async createBank(@Body() dto: CreateBankDTO) {
    return await this.bankService.getInstance().createBank(dto);
  }

  @Get(':id')
  async getBankById(@Param('id') id: number) {
    return await this.bankService.getInstance().getBankById(id);
  }

  @Get()
  async getAllBanks() {
    return await this.bankService.getInstance().getAllBanks();
  }

  @Put(':id')
  async editBank(@Param('id') id: number, @Body() dto: UpdateBankDTO) {
    return await this.bankService.getInstance().updateBank(id, dto);
  }

  @Delete(':id')
  async deleteBank(@Param('id') id: number) {
    return await this.bankService.getInstance().deleteBank(id);
  }
}
