import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ReplayCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ name: 'tourId', description: 'tour id' })
  tourId: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ name: 'commentId', description: 'comment id' })
  commentId: string;
}
