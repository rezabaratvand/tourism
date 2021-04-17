import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { Tour } from 'src/modules/tours/schema/tour.schema';
import { Booking } from '../schema/booking.schema';

export class CreateBookingDto implements Partial<Booking> {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    name: 'tour',
    description: 'tour id',
    example: '507f191e810c19729de860ea',
    required: true,
    type: String,
  })
  tour: Tour;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    name: 'price',
    description: 'booking price',
    required: true,
    type: Number,
  })
  price: number;
}
