import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TradingaccountService } from './tradingaccount.service';
import { CreateTradingaccountDto } from './dto/create-tradingaccount.dto';
import { UpdateTradingaccountDto } from './dto/update-tradingaccount.dto';

@Controller('tradingaccount')
export class TradingaccountController {
  constructor(private readonly tradingaccountService: TradingaccountService) {}
  @Post(':clientId/withdraw')
  async requestWithdrawal(
    @Param('clientId') clientId: string,
    @Body()
    body: {
      amount: number;
      country: string;
      bank: string;
      state: string;
      accNumber: string;
    },
  ) {
    return this.tradingaccountService.requestWithdrawal(
      clientId,
      body.amount,
      body.country,
      body.state,
      body.bank,
      body.accNumber,
    );
  }

  // Get trading account info
  @Get(':clientId')
  async getAccount(@Param('clientId') clientId: string) {
    return this.tradingaccountService.getAccount(clientId);
  }
  @Post()
  create(@Body() createTradingaccountDto: CreateTradingaccountDto) {
    return this.tradingaccountService.create(createTradingaccountDto);
  }

  @Get()
  findAll() {
    return this.tradingaccountService.findAll();
  }
  @Get('all/withdrawals')
  async getAllWithdrawals() {
    return this.tradingaccountService.getAllWithdrawals();
  }

  // 2) Get user withdrawals
  @Get(':clientId')
  async getUserWithdrawals(@Param('clientId') clientId: string) {
    return this.tradingaccountService.getUserWithdrawals(clientId);
  }

  // 3) Approve withdrawal
  @Post(':clientId/approve')
  async approveWithdrawal(
    @Param('clientId') clientId: string,
    @Query('withdrawalId') withdrawalId: string,
    @Query('adminId') adminId: string,
    @Body('comment') comment?: string,
  ) {
    return this.tradingaccountService.approveWithdrawal(
      clientId,
      withdrawalId,
      adminId,
      comment,
    );
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTradingaccountDto: UpdateTradingaccountDto,
  ) {
    return this.tradingaccountService.update(+id, updateTradingaccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tradingaccountService.remove(+id);
  }

  // @Patch(':id/debit')
  // debit(@Param('id') id: string, @Body('amount') amount: number) {
  //   return this.tradingaccountService.debit(id, amount);
  // }

  @Patch(':userId/credit')
  credit(@Param('userId') userId: string, @Body('amount') amount: number) {
    return this.tradingaccountService.credit(userId, amount);
  }

  @Patch(':userId/earned-fund')
  updateEarnedFund(
    @Param('userId') userId: string,
    @Body() dto: { amount: number; add?: boolean },
  ) {
    return this.tradingaccountService.updateEarnedFund(
      userId,
      dto.amount,
      dto.add ?? true,
    );
  }

  @Get(':id/transactions')
  transactions(@Param('id') id: string) {
    return this.tradingaccountService.getTransactions(id);
  }
  @Get('summary/:userId')
  async getUserSummary(@Param('userId') userId: string) {
    return this.tradingaccountService.getUserDepositWithdrawalSummary(userId);
  }

  @Get('user/:userId/withdrawals/all')
  async getUserWithdrawalsMain(@Param('userId') userId: string) {
    return this.tradingaccountService.getUserWithdrawals(userId);
  }
  @Patch(':userId/reduce-earnedfund')
  async reduceEarnedFund(
    @Param('userId') userId: string,
    @Body('amount') amount: number,
  ) {
    return this.tradingaccountService.reduceEarnedFund(userId, amount);
  }
}
