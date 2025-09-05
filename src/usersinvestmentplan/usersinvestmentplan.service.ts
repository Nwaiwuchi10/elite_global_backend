import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsersinvestmentplanDto } from './dto/create-usersinvestmentplan.dto';
import { UpdateUsersinvestmentplanDto } from './dto/update-usersinvestmentplan.dto';
import { Usersinvestmentplan } from './entities/usersinvestmentplan.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Investmentplan } from 'src/investmentplan/entities/investmentplan.entity';
import { Tradingaccount } from 'src/tradingaccount/entities/tradingaccount.entity';

@Injectable()
export class UsersinvestmentplanService {
  constructor(
    @InjectModel(Usersinvestmentplan.name)
    private readonly usersInvestmentPlanModel: Model<Usersinvestmentplan>,
    @InjectModel(Investmentplan.name)
    private readonly planModel: Model<Investmentplan>,
    @InjectModel(Tradingaccount.name)
    private readonly tradingAccModel: Model<Tradingaccount>,
  ) {}
  // investment.service.ts
  async invest(clientId: string, planId: string, amount: number) {
    const plan = await this.planModel.findById(planId);
    if (!plan) throw new NotFoundException('Plan not found');

    if (amount < plan.minAmount || amount > plan.maxAmount) {
      throw new BadRequestException('Amount not within investment range');
    }

    const tradingAcc = await this.tradingAccModel.findOne({ clientId });
    if (!tradingAcc) throw new NotFoundException('Trading account not found');

    if (tradingAcc.availableBalance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Deduct from balances
    tradingAcc.totalBalance -= amount;
    tradingAcc.availableBalance -= amount;
    await tradingAcc.save();

    // Set investment dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    const userInvestment = new this.usersInvestmentPlanModel({
      clientId,
      investmentplanId: planId,
      amount,
      startDate,
      endDate,
    });
    await userInvestment.save();

    return { message: 'Investment successful', userInvestment };
  }

  async create(
    createDto: CreateUsersinvestmentplanDto,
  ): Promise<Usersinvestmentplan> {
    const created = new this.usersInvestmentPlanModel(createDto);
    return created.save();
  }

  async findAll(): Promise<Usersinvestmentplan[]> {
    return this.usersInvestmentPlanModel
      .find()
      .populate('clientId')
      .populate('investmentplanId')
      .exec();
  }

  async findOne(id: string): Promise<Usersinvestmentplan> {
    const record = await this.usersInvestmentPlanModel
      .findById(id)
      .populate('clientId')
      .populate('investmentplanId')
      .exec();
    if (!record) throw new NotFoundException('Users investment plan not found');
    return record;
  }

  async update(
    id: string,
    updateDto: UpdateUsersinvestmentplanDto,
  ): Promise<Usersinvestmentplan> {
    const updated = await this.usersInvestmentPlanModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException('Users investment plan not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersInvestmentPlanModel
      .findByIdAndDelete(id)
      .exec();
    if (!result) throw new NotFoundException('Users investment plan not found');
  }

  // usersinvestmentplan.service.ts
  async pause(userId: string) {
    return this.usersInvestmentPlanModel.findOneAndUpdate(
      { clientId: userId },
      { isPaused: true },
      { new: true },
    );
  }

  async end(userId: string) {
    return this.usersInvestmentPlanModel.findOneAndUpdate(
      { clientId: userId },
      { isEnded: true },
      { new: true },
    );
  }

  async updateUserInvestmentPercent(userId: string, percent: number) {
    const userInvestment = await this.usersInvestmentPlanModel.findOne({
      clientId: userId,
    });
    if (!userInvestment) {
      throw new NotFoundException('User investment not found');
    }

    userInvestment.customInterestRate = percent;
    await userInvestment.save();
    return { message: 'User investment percent updated', userInvestment };
  }
  async updateUserInterestRate(userId: string, interestRate: number) {
    return this.usersInvestmentPlanModel.findOneAndUpdate(
      { clientId: userId, isEnded: false },
      { $set: { customInterestRate: interestRate } },
      { new: true },
    );
  }
  async getUserInvestments(userId: string) {
    if (!userId) {
      throw new NotFoundException('Invalid user ID');
    }

    return this.usersInvestmentPlanModel
      .find({ clientId: userId })
      .populate('investmentplanId')
      .populate('clientId')
      .sort({ createdAt: -1 })
      .exec();
  }
}
