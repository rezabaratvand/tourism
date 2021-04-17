import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { UserDocument } from '../users/schema/user.schema';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @GetUser('id') userId: UserDocument,
  ): Promise<string> {
    return await this.bookingsService.create(createBookingDto, userId);
  }

  @Get()
  async findAll(@Query() filterQueryDto: FilterQueryDto) {
    return await this.bookingsService.findAll(filterQueryDto);
  }

  @Get(':id')
  async findOne(@Param() mongoIdDto: MongoIdDto) {
    return await this.bookingsService.findOne(mongoIdDto.id);
  }
}
