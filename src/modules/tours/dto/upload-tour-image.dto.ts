import { ApiParam, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadTourImageDto {
  @ApiProperty({
    name: 'image',
    description: 'tour image',
    format: 'binary',
    required: true,
  })
  image: string;
}
