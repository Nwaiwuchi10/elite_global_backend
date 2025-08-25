import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Adminwallet extends Document {
  @Prop({ required: true })
  walletName: string;

  @Prop({ required: true })
  walletAdress: string;

  @Prop({ required: false })
  walletQR: string;
}

export const AdminwalletSchema = SchemaFactory.createForClass(Adminwallet);
