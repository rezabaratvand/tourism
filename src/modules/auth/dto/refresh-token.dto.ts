import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { RefreshToken } from '../schema/refresh-token.schema';

export class RefreshTokenDto implements Partial<RefreshToken> {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ name: 'refreshToken', format: 'uuid', required: true })
  readonly refreshToken: string;
}
