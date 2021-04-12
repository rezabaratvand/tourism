import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(512)
  @ApiProperty({
    name: 'previousPassword',
    example: '12345678',
    type: String,
    minLength: 8,
    maxLength: 512,
    required: true,
  })
  readonly previousPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(512)
  @ApiProperty({
    name: 'newPassword',
    example: '87654321',
    type: String,
    minLength: 8,
    maxLength: 512,
    required: true,
  })
  readonly newPassword: string;
}
