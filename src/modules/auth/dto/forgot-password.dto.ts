import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsPhoneNumber,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';
import { User } from 'src/modules/users/schema/user.schema';

export class ForgotPasswordDto implements Partial<User> {
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
  @MinLength(5)
  @MaxLength(256)
  @ApiProperty({
    name: 'username',
    example: 'username',
    type: String,
    minLength: 5,
    maxLength: 256,
    required: true,
  })
  readonly username: string;
}
