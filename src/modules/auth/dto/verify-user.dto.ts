import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class VerifyUserDto {
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('IR', { message: 'the phone number is wrong' })
  @ApiProperty({
    name: 'phoneNumber',
    description: 'user phoneNumber',
    example: '09123456789',
    type: String,
    minimum: 11,
    maximum: 11,
    required: true,
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'token',
    description: 'verification token',
    example: '812047',
    type: Number,
    minimum: 6,
    maximum: 6,
    required: true,
  })
  token: number;
}
