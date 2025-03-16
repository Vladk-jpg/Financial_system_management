import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Delete,
  Param,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CreateBankDTO } from 'src/application/dto/create-bank.dto';
import { BankService } from 'src/application/services/bank.service';
import { UpdateBankDTO } from 'src/application/dto/update-bank.dto';
import { ServiceProxyModule } from 'src/infrastructure/service-proxy/service-proxy.module';
import { ServiceProxy } from 'src/infrastructure/service-proxy/service-proxy';

@Controller('banks')
export class BankController {
  private readonly bankService: BankService;

  constructor(
    @Inject(ServiceProxyModule.BANK_SERVICE_PROXY)
    private readonly bankServiceProxy: ServiceProxy<BankService>,
  ) {
    this.bankService = bankServiceProxy.getInstance();
  }

  @Post()
  async createBank(@Body() dto: CreateBankDTO) {
    return await this.bankService.createBank(dto);
  }

  @Get(':id')
  async getBankById(@Param('id') id: number) {
    const bank = await this.bankService.getBankById(id);
    if (!bank) throw new NotFoundException('Bank with such id not found');
    return bank;
  }

  @Get()
  async getAllBanks() {
    return await this.bankService.getAllBanks();
  }

  @Put(':id')
  async editBank(@Param('id') id: number, @Body() dto: UpdateBankDTO) {
    const bank = await this.bankService.updateBank(id, dto);
    if (!bank) throw new NotFoundException('Bank with such id not found');
    return bank;
  }

  @Delete(':id')
  async deleteBank(@Param('id') id: number) {
    const bank = this.bankService.getBankById(id);
    if (!bank) throw new NotFoundException('Bank with such id not found');
    await this.bankService.deleteBank(id);
  }
}
