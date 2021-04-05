import {
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  IsMongoId,
  Min,
  Max,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import difficultyConst from 'src/common/constants/difficulty.const';
import { Tour } from '../schema/tour.schema';
export class CreateTourDto implements Partial<Tour> {
  @ApiProperty({
    name: 'title',
    description: 'tour title',
    example: 'The Landmark Tour',
    type: String,
    minLength: 3,
    maxLength: 255,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    name: 'description',
    example: 'The Landmark Tour',
    description: 'tour description',
    type: String,
    minLength: 3,
    maxLength: 2048,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(2048)
  description: string;

  @ApiProperty({
    name: 'startDates',
    description: 'tour start dates',
    type: [Date],
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  startDates: Array<Date>;

  @ApiProperty({
    name: 'duration',
    description: 'tour duration',
    example: 25,
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    name: 'maxGroupSize',
    description: 'maxGroupSize of each tour',
    example: 40,
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  maxGroupSize: number;

  @ApiProperty({
    name: 'difficulty',
    description: 'tour difficulty',
    enum: Object.values(difficultyConst),
    enumName: 'difficulty',
    type: String,
    required: true,
  })
  @IsEnum(Object.values(difficultyConst))
  @IsNotEmpty()
  difficulty: string;

  @ApiProperty({
    name: 'price',
    description: 'tour price',
    example: 780,
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  // @ApiProperty({
  //   name: 'ratingAverage',
  //   description: 'tour ratingAverage',
  //   type: Number,
  //   minimum: 1,
  //   maximum: 5,
  //   default: 4.5,
  // })
  // @IsNumber()
  // @IsOptional()
  // @Min(1)
  // @Max(5)
  // ratingAverage?: number;

  // @ApiProperty({
  //   name: 'ratingsQuantity',
  //   description: 'tour ratingsQuantity',
  //   type: Number,
  //   required: true,
  // })
  // @IsNumber()
  // @IsNotEmpty()
  // ratingsQuantity: number;

  // geo properties
  @ApiProperty({
    name: 'startLocation',
    description: 'tour startLocation',
    example: {
      description: 'Miami, USA',
      type: 'Point',
      coordinates: [-80.185942, 25.774772],
      address: '301 Biscayne Blvd, Miami, FL 33132, USA',
    },
    type: Object,
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  startLocation: object;

  @ApiProperty({
    name: 'locations',
    description: 'tour locations',
    example: [
      {
        description: 'Miami, USA',
        type: 'Point',
        coordinates: [-80.185942, 25.774772],
        address: '301 Biscayne Blvd, Miami, FL 33132, USA',
        day: 10,
      },
    ],
    type: Array,
  })
  @IsArray()
  @IsOptional()
  locations: [object];

  // @ApiProperty({
  //   name: 'guid',
  //   description: 'tour guid',
  //   type: User,
  // })
  // @IsMongoId()
  // @IsOptional()
  // guid: User;
}
