import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvestmentplanDto } from './dto/create-investmentplan.dto';
import { UpdateInvestmentplanDto } from './dto/update-investmentplan.dto';
import { Investmentplan } from './entities/investmentplan.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class InvestmentplanService {
  constructor(
    @InjectModel(Investmentplan.name)
    private investmentplanModel: Model<Investmentplan>,
  ) {}

  async create(createDto: CreateInvestmentplanDto): Promise<Investmentplan> {
    const newPlan = new this.investmentplanModel(createDto);
    return newPlan.save();
  }

  async findAll(): Promise<Investmentplan[]> {
    return this.investmentplanModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Investmentplan> {
    const plan = await this.investmentplanModel.findById(id).exec();
    if (!plan) throw new NotFoundException(`Investment plan ${id} not found`);
    return plan;
  }

  async update(
    id: string,
    updateDto: UpdateInvestmentplanDto,
  ): Promise<Investmentplan> {
    const updated = await this.investmentplanModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`Investment plan ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.investmentplanModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Investment plan ${id} not found`);
    return { deleted: true };
  }

  updateInterestRate(id: string, interestRate: number) {
    return this.investmentplanModel.findByIdAndUpdate(
      id,
      { interestRate },
      { new: true },
    );
  }
}
