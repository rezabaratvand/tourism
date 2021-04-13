import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Comment } from '../../comments/schema/comment.schema';

export class CreateCommentDto implements Partial<Comment> {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(2048)
  @ApiProperty({
    name: 'body',
    description: 'comment body',
    example: 'hello world',
    minLength: 2,
    maxLength: 2048,
    required: true,
  })
  body: string;
}
