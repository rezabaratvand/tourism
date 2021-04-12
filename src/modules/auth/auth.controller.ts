import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { PublicRoute } from './decorators/public-route.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyUserDto } from './dto/verify-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @ApiOperation({ summary: 'login with username and password' })
  @Post('signin')
  async signin(
    @Body() signinDto: SigninDto,
    @Req() request: Request,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signin(signinDto, request);
  }

  @PublicRoute()
  @ApiOperation({ summary: 'register new user' })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<{ verifyToken: number }> {
    return await this.authService.signup(signupDto);
  }

  @PublicRoute()
  @ApiOperation({ summary: 'verify user by phone number and verification token' })
  @Post('verify-user')
  async verifyUser(
    @Body() verifyUserDto: VerifyUserDto,
    @Req() request: Request,
  ): Promise<{ accessToken: string }> {
    return await this.authService.verifyUser(verifyUserDto, request);
  }

  @PublicRoute()
  @Post('refresh-token')
  @ApiOperation({ summary: 'refresh the access token' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshToken(refreshTokenDto);
  }
}
