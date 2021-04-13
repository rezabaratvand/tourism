import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { HelperService } from '../helper/helper.service';
import { UserDocument } from '../users/schema/user.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateTourDto } from './dto/create-tour.dto';
import { ReplayCommentDto } from './dto/replay-comment.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { Comment, CommentDocument } from '../comments/schema/comment.schema';
import { Tour, TourDocument } from './schema/tour.schema';

@Injectable()
export class ToursService {
  constructor(
    @InjectModel(Tour.name) private readonly tourModel: Model<TourDocument>,
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    private readonly helperService: HelperService,
  ) {}

  async create(createTourDto: CreateTourDto): Promise<string> {
    await this.tourModel.create(createTourDto);

    return 'tour created successfully';
  }

  async findAll(filterQueryDto: FilterQueryDto): Promise<TourDocument[]> {
    return await this.helperService.findAll(this.tourModel, filterQueryDto);
  }

  async findOne(id: string): Promise<TourDocument> {
    const tour = await this.tourModel
      .findById(id)
      .populate({ path: 'comments', select: 'body _id -tour' });

    if (!tour) throw new NotFoundException('tour not found');

    return tour;
  }

  async update(id: string, updateTourDto: UpdateTourDto): Promise<string> {
    const tour = await this.findOne(id);

    await tour.updateOne(updateTourDto);

    return 'tour updated successfully';
  }

  async remove(id: string): Promise<string> {
    const tour = await this.findOne(id);

    await tour.deleteOne();

    return 'tour removed successfully';
  }

  //* COMMENT SECTION
  async createComment(
    tourId: string,
    userId: UserDocument,
    createCommentDto: CreateCommentDto,
  ): Promise<string> {
    const tour = await this.findOne(tourId);

    await this.commentModel.create({ user: userId, tour, body: createCommentDto.body });

    return 'comment created successfully';
  }

  async getAllComments(
    tourId: string,
    filterQueryDto: FilterQueryDto,
  ): Promise<CommentDocument[]> {
    await this.findOne(tourId);

    return await this.helperService.findAll(this.commentModel, filterQueryDto);
  }

  async createReplayComment(
    userId: UserDocument,
    replayCommentDto: ReplayCommentDto,
    createCommentDto: CreateCommentDto,
  ) {
    const { commentId, tourId } = replayCommentDto;

    await this.findOne(tourId);

    const parent = await this.commentModel.findById(commentId);

    if (!parent)
      throw new NotFoundException('not found comment with the entered commentId');

    await this.commentModel.create({
      user: userId,
      tour: tourId,
      parent,
      body: createCommentDto.body,
    });

    return 'comment created successfully';
  }
}
