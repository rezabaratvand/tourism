import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // super admin routes
  @Patch(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'update comment by id' })
  async update(
    @Param() mongoIdDto: MongoIdDto,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<string> {
    return await this.commentsService.update(mongoIdDto.id, updateCommentDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'delete comment by id' })
  async remove(@Param() mongoIdDto: MongoIdDto): Promise<string> {
    return await this.commentsService.remove(mongoIdDto.id);
  }
}
