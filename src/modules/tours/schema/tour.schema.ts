import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Schema, Prop, raw, SchemaFactory } from '@nestjs/mongoose';
import difficultyConst from '../../../common/constants/difficulty.const';

export type TourDocument = Tour & Document;

@Schema({ versionKey: false, timestamps: true })
export class Tour {
  @Prop({ type: String, required: true, minlength: 3, maxlength: 255 })
  title: string;

  @Prop({ type: String, required: true, minlength: 3, maxlength: 2048 })
  description: string;

  @Prop({ type: [Date], required: true })
  startDates: Array<Date>;

  @Prop({ type: Number, required: true })
  duration: number;

  @Prop({ type: Number, required: true })
  maxGroupSize: number;

  @Prop({ type: String, enum: Object.values(difficultyConst), required: true })
  difficulty: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({
    type: Number,
    default: 4.5,
    min: 1,
    max: 5,
    set: rate => Math.round(rate * 10) / 10,
  })
  ratingAverage: number;

  @Prop({ type: Number })
  ratingsQuantity: number;

  // geo property
  @Prop({
    type: { type: 'String', default: 'Point' },
    coordinates: [Number],
    description: String,
    address: String,
  })
  startLocation: object;

  @Prop(
    raw([
      {
        type: { type: 'String', default: 'Point' },
        coordinates: [Number],
        description: String,
        address: String,
        day: Number,
      },
    ]),
  )
  locations: Array<object>;

  // guid: User
}

export const TourSchema = SchemaFactory.createForClass(Tour);
