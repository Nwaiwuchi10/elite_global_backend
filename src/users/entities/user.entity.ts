import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  referralCode: string; // generated on signup

  @Prop({ type: String, default: null })
  referredBy?: string; // stores referralCode of the referrer

  @Prop({ default: 0 })
  referralBalance: number;

  @Prop({ default: 0 })
  referralCount: number; // total people referred

  @Prop({ default: false })
  isBlocked: boolean; // block login

  @Prop({ default: false })
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
