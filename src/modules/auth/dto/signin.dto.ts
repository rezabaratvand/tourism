import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { User } from 'src/modules/users/schema/user.schema';

export class SigninDto implements Partial<User> {
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
  username: string;

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
