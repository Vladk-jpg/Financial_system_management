import { Controller, Post, Get, Put, Body, Delete, Param } from '@nestjs/common';
import { CreateBankDTO } from 'src/application/dto/create-bank.dto';
import { BankService } from 'src/application/services/bank.service';
import { UpdateBankDTO } from 'src/application/dto/update-bank.dto';
import { PARAMTYPES_METADATA } from '@nestjs/common/constants';

@Controller('banks')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post('create')
  async createBank(@Body() dto: CreateBankDTO) {
    return await this.bankService.createBank(dto);
  }

  @Get(':id')
  async getBankById(@Param('id') id: number) {
    return await this.bankService.getBankById(id);
  }

  @Get()
  async getAllBanks() {
    return await this.bankService.getAllBanks();
  }

  @Put(':id')
  async editBank(@Param('id') id: number, @Body() dto: UpdateBankDTO) 
  {
    return await this.bankService.updateBank(id, dto);
  }

  @Delete(':id')
  async deleteBank(@Param('id') id: number)
  {
    return await this.bankService.deleteBank(id);
  }

}
