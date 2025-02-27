import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CreateBankUseCase } from 'src/application/use-cases/create-bank.use-case';
import { BankRepository } from 'src/infrastructure/database/repositories/bank.repository.impl';
import { CreateBankDTO } from 'src/application/dto/create-bank.dto';

@Controller('banks')
export class BankController {
  constructor(
    private readonly createBankUseCase: CreateBankUseCase,
  ) {}

  @Post('create')
  async createBank(@Body() dto: CreateBankDTO) {
    return await this.createBankUseCase.execute(dto);
  }

  // @Get(':id')
  // async getBankById(@Param('id') id: number) {
  //   return await this.bankRepository.findById(id);
  // }

  // @Get()
  // async getAllBanks() {
  //   return await this.bankRepository.findAll();
  // }
}
