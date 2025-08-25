import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTradingaccountDto } from './dto/create-tradingaccount.dto';
import { UpdateTradingaccountDto } from './dto/update-tradingaccount.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tradingaccount } from './entities/tradingaccount.entity';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Usersinvestmentplan } from 'src/usersinvestmentplan/entities/usersinvestmentplan.entity';

@Injectable()
export class TradingaccountService {
  constructor(
    @InjectModel(Tradingaccount.name)
    private readonly tradingAccModel: Model<Tradingaccount>,
    @InjectModel(Usersinvestmentplan.name)
    private readonly userInvestmentModel: Model<Usersinvestmentplan>,
  ) {}

  // tradingaccount.service.ts
  async requestWithdrawal(
    clientId: string,
    amount: number,
    accNumber: string,
    bank: string,
    country: string,
    state: string,
  ) {
    const acc = await this.tradingAccModel.findOne({ clientId });
    if (!acc) throw new NotFoundException('Trading account not found');

    if (acc.availableBalance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    acc.availableBalance -= amount;
    acc.totalBalance -= amount;

    acc.withdrawals.push({
      amount,
      country,
      state,
      bank,
      accNumber,
      status: 'pending',
      statusDetails: { date: new Date() },
      createdAt: new Date(),
    });

    await acc.save();

    return { message: 'Withdrawal request submitted', account: acc };
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async applyDailyInterest() {
    const investments = await this.userInvestmentModel
      .find()
      .populate('investmentplanId');

    for (const inv of investments) {
      const plan = inv.investmentplanId as any;
      const clientAcc = await this.tradingAccModel.findOne({
        clientId: inv.clientId,
      });
      if (!clientAcc) continue;

      // Simple daily interest = (totalBalance * interestRate) / 365
      const dailyInterest =
        (clientAcc.totalBalance * plan.interestRate) / 36500;

      clientAcc.totalBalance += dailyInterest;
      clientAcc.availableBalance += dailyInterest;

      await clientAcc.save();
    }
  }

  create(createTradingaccountDto: CreateTradingaccountDto) {
    return 'This action adds a new tradingaccount';
  }

  findAll() {
    return `This action returns all tradingaccount`;
  }

  getAccount(clientId: string) {
    const account = this.tradingAccModel
      .findOne({ clientId: clientId })
      .populate('clientId');
    if (!account) {
      return new NotFoundException('Account not found');
    }
    return account;
  }
  async getAllWithdrawals() {
    const accounts: any = await this.tradingAccModel
      .find()
      .populate('clientId');
    return accounts.flatMap((acc: any) =>
      acc.withdrawals.map((w: any) => ({
        ...w.toObject(),
        client: acc.clientId,
      })),
    );
  }

  // 2) Get a user’s withdrawals
  async getUserWithdrawals(clientId: string) {
    const acc = await this.tradingAccModel.findOne({ clientId });
    if (!acc) throw new NotFoundException('Trading account not found');
    return acc.withdrawals;
  }

  // 3) Approve withdrawal
  async approveWithdrawal(
    clientId: string,
    withdrawalId: string,
    adminId: string,
    comment?: string,
  ) {
    const acc: any = await this.tradingAccModel.findOne({ clientId });
    if (!acc) throw new NotFoundException('Trading account not found');

    const withdrawal = acc.withdrawals.id(withdrawalId);
    if (!withdrawal) throw new NotFoundException('Withdrawal not found');

    if (withdrawal.status !== 'pending') {
      throw new BadRequestException('Withdrawal already processed');
    }

    withdrawal.status = 'approved';
    withdrawal.statusDetails = {
      comment,
      approvedBy: adminId,
      date: new Date(),
    };

    await acc.save();
    return { message: 'Withdrawal approved successfully', withdrawal };
  }
  update(id: number, updateTradingaccountDto: UpdateTradingaccountDto) {
    return `This action updates a #${id} tradingaccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} tradingaccount`;
  }
}
