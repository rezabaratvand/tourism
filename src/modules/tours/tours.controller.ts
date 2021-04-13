import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';
import { PublicRoute } from '../auth/decorators/public-route.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserDocument } from '../users/schema/user.schema';
import { CommentDocument } from '../comments/schema/comment.schema';
import { ReplayCommentDto } from './dto/replay-comment.dto';
import { uploadSingleFile } from 'src/utils/upload-file.util';
import { UploadTourImageDto } from './dto/upload-tour-image.dto';

@ApiTags('tours')
@ApiBearerAuth()
@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  @ApiOperation({ summary: 'create new tour' })
  @ApiCreatedResponse()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTourDto: CreateTourDto) {
    return await this.toursService.create(createTourDto);
  }

  @Get()
  @PublicRoute()
  @ApiOperation({ summary: 'get all tours' })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filterQueryDto: FilterQueryDto) {
    return await this.toursService.findAll(filterQueryDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'get a tour by id' })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param() mongoIdDto: MongoIdDto) {
    return await this.toursService.findOne(mongoIdDto.id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'update a tour by id' })
  @ApiCreatedResponse()
  @HttpCode(HttpStatus.CREATED)
  async update(@Param() mongoIdDto: MongoIdDto, @Body() updateTourDto: UpdateTourDto) {
    return await this.toursService.update(mongoIdDto.id, updateTourDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'delete a tour by id' })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async remove(@Param() mongoIdDto: MongoIdDto) {
    return await this.toursService.remove(mongoIdDto.id);
  }

  @Patch('/upload-image/:id')
  @ApiParam({ name: 'id' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(uploadSingleFile('image', 'uploads/tours'))
  async uploadTourImage(
    @Param() mongoIdDto: MongoIdDto,
    @Body() uploadTourImageDto: UploadTourImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.toursService.uploadTourImage(mongoIdDto.id, file);
  }

  //* COMMENT SECTION

  @Post(':id/comments')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'create new comment on the specific tour' })
  async createComment(
    @Param() mongoIdDto: MongoIdDto,
    @GetUser('id') userId: UserDocument,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.toursService.createComment(mongoIdDto.id, userId, createCommentDto);
  }

  @PublicRoute()
  @Get(':id/comments')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'get all comments related to specific tour' })
  async getAllComments(
    @Query() filterQueryDto: FilterQueryDto,
    @Param() mongoIdDto: MongoIdDto,
  ): Promise<CommentDocument[]> {
    return await this.toursService.getAllComments(mongoIdDto.id, filterQueryDto);
  }

  @Post(':tourId/comments/:commentId')
  @ApiParam({ name: 'commentId' })
  @ApiParam({ name: 'tourId' })
  @ApiOperation({ summary: 'create a replay comment on a specific comment id' })
  async createReplayComment(
    @Param() replayCommentDto: ReplayCommentDto,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser('id') userId: UserDocument,
  ) {
    return await this.toursService.createReplayComment(
      userId,
      replayCommentDto,
      createCommentDto,
    );
  }
}
