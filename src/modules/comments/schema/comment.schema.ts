import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/modules/users/schema/user.schema';
import { Tour } from '../../tours/schema/tour.schema';

export type CommentDocument = Comment & Document;

@Schema({ versionKey: false, timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tour.name, required: true })
  tour: Tour;

  @Prop({ type: String, minlength: 2, maxlength: 2048, required: true })
  body: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Comment.name })
  parent?: Comment;

  @Prop({ type: Boolean, default: false })
  visibility?: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
