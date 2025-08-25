import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export const DEPOSIT_STATUS_ENUM = ['Approved', 'Pending'];
@Schema({ timestamps: true })
export class Deposit extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Adminwallet' })
  adminWalletId: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  amount: number;

  @Prop({ required: true, default: false })
  havePaid: boolean;

  @Prop({ required: true, default: false })
  approvePayment: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId;

  @Prop({
    enum: DEPOSIT_STATUS_ENUM,
    default: 'Pending',
  })
  depositStatus: string;
}

export const DepositSchema = SchemaFactory.createForClass(Deposit);
