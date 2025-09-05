import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Usersinvestmentplan extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Investmentplan', required: true })
  investmentplanId: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  amount: number;

  @Prop({ default: false })
  isPaused: boolean;

  @Prop({ default: false })
  isEnded: boolean;
  @Prop({ required: false })
  customInterestRate?: number;

  @Prop({ type: Date, default: Date.now })
  startDate: Date;
  @Prop({ type: Date })
  endDate: Date;
}

export const UsersinvestmentplanSchema =
  SchemaFactory.createForClass(Usersinvestmentplan);
