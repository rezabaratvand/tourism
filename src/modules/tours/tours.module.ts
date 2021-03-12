import { Module } from '@nestjs/common';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tour, TourSchema } from './schema/tour.schema';

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
    ]),
  ],
  controllers: [ToursController],
  providers: [ToursService],
})
export class ToursModule {}
