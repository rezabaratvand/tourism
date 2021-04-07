import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseFilters,
  ForbiddenException,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomForbiddenException } from 'src/exception/custom-forbidden.exception';
import { HttpExceptionFilter } from 'src/exception/exception-filter.exception';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { ApiTags } from '@nestjs/swagger';

// controller leven exception filter
// @UseFilters(HttpExceptionFilter)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  // method leven filters
  // @UseFilters(HttpExceptionFilter)
  @Get()
  findAll() {
    // throw new CustomForbiddenException();
    // throw new ForbiddenException();
    // console.log(id);

    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param() mongoId: MongoIdDto) {
    return this.usersService.findOne(mongoId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.usersService.remove(+id);
    // throw new HttpException(
    //   {
    //     status: HttpStatus.FORBIDDEN,
    //     error: 'this route is not public',
    //   },
    //   HttpStatus.FORBIDDEN,
    // );
  }
}
