import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Investmentplan extends Document {
  @Prop({ required: true })
  planName: string;

  @Prop({ required: true, default: 0 })
  minAmount: number;

  @Prop({ required: true, default: 0 })
  maxAmount: number;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: false })
  interestRate: number;
}

export const InvestmentplanSchema =
  SchemaFactory.createForClass(Investmentplan);
