import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Comment } from '../schema/comment.schema';

export class UpdateCommentDto implements Partial<Comment> {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(2048)
  @ApiProperty({
    name: 'body',
    description: 'comment body',
    example: 'hello world',
    minLength: 2,
    maxLength: 2048,
    required: false,
  })
  body?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    name: 'visibility',
    description: 'comment visibility',
    default: false,
    required: false,
  })
  visibility?: boolean;
}
