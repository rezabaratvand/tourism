import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { uploadSingleFile } from 'src/utils/upload-file.util';
import { UserDocument } from './schema/user.schema';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'create new user' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(uploadSingleFile('avatar', 'uploads/avatars'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.usersService.create(createUserDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'get all users' })
  async findAll(@Query() filterQueryDto: FilterQueryDto): Promise<UserDocument[]> {
    return await this.usersService.findAll(filterQueryDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'get a user by id' })
  async findOne(@Param() mongoId: MongoIdDto): Promise<UserDocument> {
    return await this.usersService.findOne(mongoId);
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'update user by id' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(uploadSingleFile('avatar', 'uploads/avatars'))
  async update(
    @Param() mongoId: MongoIdDto,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return this.usersService.update(mongoId, updateUserDto, file);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'delete user by id' })
  async remove(@Param() mongoId: MongoIdDto): Promise<string> {
    return await this.usersService.remove(mongoId);
  }
}
