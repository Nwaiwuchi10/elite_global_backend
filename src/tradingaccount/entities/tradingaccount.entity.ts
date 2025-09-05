import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Tradingaccount extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Investmentplan', required: false })
  userInvestmentPlanId: Types.ObjectId;
  @Prop({ default: 0 })
  availableBalance: number;

  @Prop({ default: 0 })
  earnedFund: number;

  @Prop({ default: 0 })
  totalBalance: number;

  @Prop({
    type: [
      {
        amount: { type: Number, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        accNumber: { type: String, required: true },
        bank: { type: String, required: true },

        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        statusDetails: {
          type: {
            comment: { type: String, required: false },
            approvedBy: { type: Types.ObjectId, ref: 'User', required: false },
            acknowledgeBy: {
              type: Types.ObjectId,
              ref: 'User',
              required: false,
            },
            date: { type: Date, default: Date.now },
          },
          default: {},
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  withdrawals: Array<{
    amount: number;
    country: string;
    state: string;
    accNumber: string;
    bank: string;
    status: string;

    statusDetails: {
      comment?: string;
      approvedBy?: Types.ObjectId;
      acknowledgeBy?: Types.ObjectId;
      date?: Date;
    };

    createdAt: Date;
  }>;
}

export const TradingaccountSchema =
  SchemaFactory.createForClass(Tradingaccount);
