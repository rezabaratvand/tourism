import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';
import { HelperService } from '../helper/helper.service';
import { UserDocument } from '../users/schema/user.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, BookingDocument } from './schema/booking.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    private readonly helperService: HelperService,
  ) {}
  async create(
    createBookingDto: CreateBookingDto,
    userId: UserDocument,
  ): Promise<string> {
    const { tour, price } = createBookingDto;

    await this.bookingModel.create({ user: userId, tour, price });

    return 'booking record created successfully';
  }

  async findAll(filterQueryDto: FilterQueryDto): Promise<BookingDocument[]> {
    return await this.helperService.findAll(this.bookingModel, filterQueryDto, [
      'tour',
      'user',
    ]);
  }

  async findOne(id: string): Promise<BookingDocument> {
    const booking = await this.bookingModel.findById(id);

    if (booking) throw new NotFoundException('booking record not found');

    return booking;
  }
}
