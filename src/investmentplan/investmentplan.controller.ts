import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InvestmentplanService } from './investmentplan.service';
import { CreateInvestmentplanDto } from './dto/create-investmentplan.dto';
import { UpdateInvestmentplanDto } from './dto/update-investmentplan.dto';

@Controller('investmentplan')
export class InvestmentplanController {
  constructor(private readonly investmentplanService: InvestmentplanService) {}

  @Post()
  create(@Body() createDto: CreateInvestmentplanDto) {
    return this.investmentplanService.create(createDto);
  }

  @Get()
  findAll() {
    return this.investmentplanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investmentplanService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateInvestmentplanDto) {
    return this.investmentplanService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.investmentplanService.remove(id);
  }
  @Patch(':id/interest-rate')
  updateRate(
    @Param('id') id: string,
    @Body('interestRate') interestRate: number,
  ) {
    return this.investmentplanService.updateInterestRate(id, interestRate);
  }
}
