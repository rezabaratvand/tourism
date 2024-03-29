import { Module } from '@nestjs/common';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tour, TourSchema } from './schema/tour.schema';
import { Comment, CommentSchema } from '../comments/schema/comment.schema';

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
  controllers: [ToursController],
  providers: [ToursService],
})
export class ToursModule {}
