import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';
import * as mongoose from 'mongoose';
import { User } from 'src/modules/users/schema/user.schema';
import { Tour } from 'src/modules/tours/schema/tour.schema';

export type BookingDocument = Booking & Document;

@Schema({ versionKey: false, timestamps: true })
export class Booking {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tour.name, required: true })
  tour: Tour;

  @Prop({ type: Number, required: true })
  price: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// before find booking docs populate user and tour
BookingSchema.pre(/^find/, function (next: NextFunction) {
  this.populate('user').populate({ path: 'tour', select: 'name' });
});
