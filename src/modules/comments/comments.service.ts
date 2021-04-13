import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './schema/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
  ) {}

  async findById(id: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(id);

    if (!comment) throw new NotFoundException('comment not found');

    return comment;
  }
  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<string> {
    const comment = await this.findById(id);

    await comment.updateOne(updateCommentDto);

    return 'comment updated successfully';
  }

  async remove(id: string): Promise<string> {
    const comment = await this.findById(id);

    await comment.deleteOne();

    return 'comment removed successfully';
  }
}
