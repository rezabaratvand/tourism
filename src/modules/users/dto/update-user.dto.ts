import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import rolesConst from '../constants/roles.const';
import { User } from '../schema/user.schema';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) implements Partial<User> {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(256)
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(512)
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(256)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsEnum(rolesConst)
  role?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('IR', { message: 'the phone number is wrong' })
  phoneNumber?: string;
}
