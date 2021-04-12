import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from 'src/modules/users/schema/user.schema';

export class ResetPasswordDto implements Partial<User> {
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
  readonly phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(512)
  @ApiProperty({
    name: 'password',
    description: 'user password',
    example: '12345678',
    type: String,
    minLength: 8,
    maxLength: 512,
    required: true,
  })
  password: string;
}
