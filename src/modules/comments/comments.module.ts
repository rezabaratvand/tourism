import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schema/comment.schema';
import { Tour, TourSchema } from '../tours/schema/tour.schema';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Tour.name,
        useFactory: () => {
          const schema = TourSchema;
          return schema;
        },
      },
      {
        name: Comment.name,
        useFactory: () => {
          const schema = CommentSchema;
          return schema;
        },
      },
    ]),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
