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
}

export const UsersinvestmentplanSchema =
  SchemaFactory.createForClass(Usersinvestmentplan);
