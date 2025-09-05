import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTradingaccountDto } from './dto/create-tradingaccount.dto';
import { UpdateTradingaccountDto } from './dto/update-tradingaccount.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tradingaccount } from './entities/tradingaccount.entity';
import { Model, Types } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Usersinvestmentplan } from 'src/usersinvestmentplan/entities/usersinvestmentplan.entity';
import { MailService } from 'src/users/services/mai.service';
import { User } from 'src/users/entities/user.entity';
import { Deposit } from 'src/deposit/entities/deposit.entity';

@Injectable()
export class TradingaccountService {
  constructor(
    @InjectModel(Tradingaccount.name)
    private readonly tradingAccModel: Model<Tradingaccount>,
    @InjectModel(Usersinvestmentplan.name)
    private readonly userInvestmentModel: Model<Usersinvestmentplan>,
    @InjectModel(User.name)
    private readonly depositModel: Model<Deposit>,
    @InjectModel(Deposit.name)
    private readonly userModel: Model<User>,
    private readonly mailService: MailService,
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

    // ✅ Check if client has an active investment that has not ended
    const activeInvestment = await this.userInvestmentModel.findOne({
      clientId,
      isEnded: false,
      isPaused: false,
      endDate: { $gt: new Date() }, // still running
    });

    if (activeInvestment) {
      throw new BadRequestException(
        'Withdrawal not allowed until investment end date',
      );
    }

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

    // Send withdrawal requested notification
    const user = await this.userModel.findById(clientId);
    if (user) {
      await this.mailService.sendWithdrawalRequested(
        user.email,
        user.firstName,
        user.lastName,
        amount,
      );
    }

    return { message: 'Withdrawal request submitted', account: acc };
  }

  async requestWithdrawaly(
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
    // Send withdrawal requested notification
    const user = await this.userModel.findById(clientId);
    if (user) {
      await this.mailService.sendWithdrawalRequested(
        user.email,
        user.firstName,
        user.lastName,
        amount,
      );
    }
    return { message: 'Withdrawal request submitted', account: acc };
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async applyDailyInterest() {
    const investments = await this.userInvestmentModel
      .find({ isPaused: false, isEnded: false }) // skip paused or ended plans
      .populate('investmentplanId');

    for (const inv of investments) {
      const plan = inv.investmentplanId as any;
      const clientAcc = await this.tradingAccModel.findOne({
        clientId: inv.clientId,
      });
      if (!clientAcc) continue;

      const rate = inv.customInterestRate ?? plan.interestRate;

      // Better to use investment amount as base, not just earnedFund
      const baseAmount = inv.amount;
      const dailyInterest = (baseAmount * rate) / 36500;

      clientAcc.earnedFund += dailyInterest;
      clientAcc.totalBalance += dailyInterest; // optional, keep balances aligned
      await clientAcc.save();
    }
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async applyDailyInterest() {
  //   const investments = await this.userInvestmentModel
  //     .find()
  //     .populate('investmentplanId');

  //   for (const inv of investments) {
  //     const plan = inv.investmentplanId as any;
  //     const clientAcc = await this.tradingAccModel.findOne({
  //       clientId: inv.clientId,
  //     });
  //     if (!clientAcc) continue;

  //     const rate = inv.customInterestRate ?? plan.interestRate;
  //     const dailyInterest = (clientAcc.earnedFund * rate) / 36500;

  //     clientAcc.earnedFund += dailyInterest;
  //     await clientAcc.save();
  //   }
  // }

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
  async getUserWithdrawalsy(clientId: string) {
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
    const user = await this.userModel.findById(clientId);
    if (user) {
      await this.mailService.sendWithdrawalApproved(
        user.email,
        user.firstName,
        user.lastName,
        withdrawal.amount,
        withdrawal.bank,
        withdrawal.accNumber,
      );
    }
    return { message: 'Withdrawal approved successfully', withdrawal };
  }
  update(id: number, updateTradingaccountDto: UpdateTradingaccountDto) {
    return `This action updates a #${id} tradingaccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} tradingaccount`;
  }

  async getUserDepositWithdrawalSummary(userId: string) {
    if (!userId) {
      throw new NotFoundException('Invalid user ID');
    }

    // 1) Get deposits + total deposits
    const deposits = await this.depositModel
      .find({ clientId: userId })
      .populate('adminWalletId')
      .populate('clientId')
      .sort({ createdAt: -1 })
      .exec();

    const totalDeposits = deposits.reduce((sum, dep) => sum + dep.amount, 0);

    // 2) Get total withdrawals using aggregation
    const withdrawalsAgg = await this.tradingAccModel.aggregate([
      { $match: { clientId: userId } },
      { $unwind: '$withdrawals' },
      {
        $group: {
          _id: null,
          totalWithdrawals: { $sum: '$withdrawals.amount' },
        },
      },
    ]);

    const totalWithdrawals = withdrawalsAgg[0]?.totalWithdrawals || 0;

    // 3) Return combined summary
    return {
      userId,
      totalDeposits,
      totalWithdrawals,
      deposits,
    };
  }

  async getUserDepositWithdrawalSummaryFe(userId: string) {
    // const userObjectId = new Types.ObjectId(userId);
    const userObjectId = userId;

    // 🔹 Get total deposits (only approved ones)
    const deposits = await this.depositModel.aggregate([
      { $match: { clientId: userObjectId, depositStatus: 'Approved' } },
      { $group: { _id: null, totalDeposited: { $sum: '$amount' } } },
    ]);

    const totalDeposited = deposits.length > 0 ? deposits[0].totalDeposited : 0;

    // 🔹 Get total withdrawals (only approved ones)
    const withdrawals = await this.tradingAccModel.aggregate([
      { $match: { clientId: userObjectId } },
      { $unwind: '$withdrawals' },
      { $match: { 'withdrawals.status': 'approved' } },
      {
        $group: { _id: null, totalWithdrawn: { $sum: '$withdrawals.amount' } },
      },
    ]);

    const totalWithdrawn =
      withdrawals.length > 0 ? withdrawals[0].totalWithdrawn : 0;

    return {
      userId,
      totalDeposited,
      totalWithdrawn,
    };
  }
  // tradingaccount.service.ts
  async credit(userId: string, amount: number) {
    return this.tradingAccModel.findOneAndUpdate(
      { clientId: userId },
      { $inc: { availableBalance: amount, totalBalance: amount } },
      { new: true },
    );
  }

  async updateEarnedFund(userId: string, amount: number, add = true) {
    return this.tradingAccModel.findOneAndUpdate(
      { clientId: userId },
      add ? { $inc: { earnedFund: amount } } : { $set: { earnedFund: amount } },
      { new: true },
    );
  }
  async reduceEarnedFund(userId: string, amount: number) {
    return this.tradingAccModel.findOneAndUpdate(
      { clientId: userId },
      { $inc: { earnedFund: -amount } },
      { new: true },
    );
  }

  async getTransactions(id: string) {
    const account = await this.tradingAccModel.findOne({ clientId: id });
    if (!account) throw new NotFoundException('Trading account not found');
    const deposits = await this.depositModel.find({
      clientId: account.clientId,
      // new Types.ObjectId(account.clientId)
    });
    return { deposits, withdrawals: account.withdrawals };
  }

  async getUserWithdrawals(userId: string) {
    if (!userId) {
      throw new NotFoundException('Invalid user ID');
    }

    const account = await this.tradingAccModel
      .findOne({ clientId: userId })
      .exec();
    if (!account) {
      throw new NotFoundException('Trading account not found for user');
    }

    // Return withdrawals sorted by createdAt (latest first)
    return account.withdrawals.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }
}
