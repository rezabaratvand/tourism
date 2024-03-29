import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schema/user.schema';

export type ForgotPasswordDocument = ForgotPassword & Document;
@Schema({ versionKey: false, timestamps: true })
export class ForgotPassword {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User;

  @Prop({ type: Number, required: true })
  token: number;

  @Prop({ type: Date, required: true })
  expiration: Date;

  @Prop({ type: String, required: true })
  agent: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: Boolean, default: false })
  used: boolean;
}

export const ForgotPasswordSchema = SchemaFactory.createForClass(ForgotPassword);
