import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';
export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ type: String, minlength: 5, maxlength: 256, trim: true, required: true })
  username: string;

  @Prop({ type: String, minlength: 8, maxlength: 512, required: true })
  password: string;

  @Prop({ type: String, minlength: 2, maxlength: 256, trim: true, required: true })
  fullName: string;

  @Prop({ type: String, length: 11, required: true })
  phoneNumber: string;

  @Prop({ type: Boolean, default: false })
  verified?: boolean;

  @Prop({ type: Number, length: 6 })
  verificationCode?: number;

  @Prop({ type: Date })
  verificationExpiration?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

//! encrypt password fields before saving
UserSchema.pre('save', async function (next: NextFunction): Promise<void> {
  if (!this.isModified('password')) return next();

  this['password'] = await bcrypt.hash(this['password'], 12);

  next();
});

UserSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this['password']);
};
