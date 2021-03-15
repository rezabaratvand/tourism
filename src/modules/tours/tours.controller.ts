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
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('tours')
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
  @ApiOperation({ summary: 'get all tours' })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.toursService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'get a tour by id' })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param() mongoIdDto: MongoIdDto) {
    return await this.toursService.findOne(mongoIdDto);
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'update a tour by id' })
  @ApiCreatedResponse()
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param() mongoIdDto: MongoIdDto,
    @Body() updateTourDto: UpdateTourDto,
  ) {
    return await this.toursService.update(mongoIdDto, updateTourDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'delete a tour by id' })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async remove(@Param() mongoIdDto: MongoIdDto) {
    return await this.toursService.remove(mongoIdDto);
  }
}
