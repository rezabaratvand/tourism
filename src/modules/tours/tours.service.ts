import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { Tour, TourDocument } from './schema/tour.schema';

@Injectable()
export class ToursService {
  constructor(
    @InjectModel(Tour.name) private readonly tourModel: Model<TourDocument>,
  ) {}

  async create(createTourDto: CreateTourDto): Promise<string> {
    await this.tourModel.create(createTourDto);

    return 'tour created successfully';
  }

  async findAll(): Promise<TourDocument[]> {
    return await this.tourModel.find();
  }

  async findOne(mongoIdDto: MongoIdDto): Promise<TourDocument> {
    const tour = await this.tourModel.findById(mongoIdDto.id);

    if (tour) throw new NotFoundException('tour not found');

    return tour;
  }

  async update(
    mongoIdDto: MongoIdDto,
    updateTourDto: UpdateTourDto,
  ): Promise<string> {
    const tour = await this.findOne(mongoIdDto);

    await tour.updateOne(updateTourDto);

    return 'tour updated successfully';
  }

  async remove(mongoIdDto: MongoIdDto): Promise<string> {
    const tour = await this.findOne(mongoIdDto);

    await tour.deleteOne();

    return 'tour removed successfully';
  }
}
