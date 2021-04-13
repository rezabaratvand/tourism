import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import rolesConst from '../constants/roles.const';
import { User } from '../schema/user.schema';
export class CreateUserDto implements Partial<User> {
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

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(256)
  @ApiProperty({
    name: 'fullName',
    example: 'rezaBaratvand',
    type: String,
    minLength: 2,
    maxLength: 256,
    required: true,
  })
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    name: 'email',
    example: 'user@gmail.com',
    type: String,
    maxLength: 512,
    required: true,
  })
  email: string;

  @IsOptional()
  @IsEnum(rolesConst)
  @ApiProperty({
    name: 'role',
    example: 'admin',
    enum: Object.values(rolesConst),
    default: rolesConst.USER,
  })
  role?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'avatar',
    description: 'avatar image',
    format: 'binary',
    required: false,
  })
  avatar?: string;

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
}
