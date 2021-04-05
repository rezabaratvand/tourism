import { ApiProperty } from '@nestjs/swagger';
import { User } from '../schema/user.schema';

export class CreateUserDto implements Partial<User> {
  @ApiProperty({
    name: 'username',
    example: 'username',
    type: String,
    minLength: 5,
    maxLength: 256,
    required: true,
  })
  username: string;

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

  @ApiProperty({
    name: 'fullName',
    example: 'rezaBaratvand',
    type: String,
    minLength: 2,
    maxLength: 256,
    required: true,
  })
  fullName: string;

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
}
