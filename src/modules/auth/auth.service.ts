import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { addHours, addMinutes } from 'date-fns';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import globalConst from '../../common/constants/global.const';
import { VerifyUserDto } from './dto/verify-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshToken, RefreshTokenDocument } from './schema/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
import { getClientIp } from 'request-ip';
import { Request } from 'express';
import { ForgotPassword, ForgotPasswordDocument } from './schema/forgot-password.schema';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-my-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ForgotPassword.name)
    private readonly forgotPasswordModel: Model<ForgotPasswordDocument>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  //! SIGNIN USER
  async signin(
    signinDto: SigninDto,
    request: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = signinDto;
    const filter = { username, verified: true };

    const user: any = await this.userModel.findOne(filter).select('+password +verified');

    /**
     //? it must refactor and move to a separate method like: 'validateUserInfo' .
     */
    if (!user || !(await user.validatePassword(password)))
      throw new UnauthorizedException('the username/password is invalid');

    return await this.generateTokens(request, user._id);
  }

  //! SIGNUP NEW USER
  async signup(signupDto: SignupDto): Promise<{ verifyToken: number }> {
    const { username, password, fullName, phoneNumber } = signupDto;

    //! check username or phoneNumber entered to be unique
    await this.checkUserPreExistence(signupDto);

    const filter = { username, verified: true };
    /**
     //? it must refactor and move to a factory service
     */
    let user = await this.userModel.findOne(filter);
    if (user) throw new BadRequestException('the username already exists');

    user = await this.userModel.create({ username, password, fullName, phoneNumber });

    //set user verification info
    await this.setVerifyInfo(user);

    return { verifyToken: user.verificationCode };
  }

  //! VERIFY USER
  async verifyUser(
    verifyUserDto: VerifyUserDto,
    request: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { phoneNumber, token } = verifyUserDto;
    const filter = {
      phoneNumber,
      verificationCode: token,
      verificationExpiration: { $gt: new Date() },
      verified: false,
    };

    /**
     //? the following code must be refactored and moved to a new method
    */
    const user = await this.userModel.findOne(filter);
    if (!user)
      throw new NotFoundException('The phone number or token entered is not valid');

    //! set user verificationCode and expiration as undefined and verified as true
    user.verified = true;
    user.verificationCode = user.verificationExpiration = undefined;

    await user.save();

    return await this.generateTokens(request, user._id);
  }

  //! REFRESH ACCESS TOKEN
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshTokenDto;

    // validate token
    const token = await this.refreshTokenModel.findOne({ refreshToken });
    if (!token) throw new UnauthorizedException();

    // check user availability
    const user = await this.userModel.findById(token.user);
    if (!user) throw new UnauthorizedException();

    return { accessToken: await this.singToken(user._id) };
  }

  //! FORGOT PASSWORD
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
    request: Request,
  ): Promise<{ forgotPasswordToken: number }> {
    const { phoneNumber, username } = forgotPasswordDto;

    // find user with the given phoneNumber
    const filter = { verified: true, phoneNumber, username };
    const user = await this.findUser(filter);

    // create new forgotPassword instance
    const forgotPasswordToken = await this.createForgotPassword(user._id, request);

    // return forgotPasswordToken
    return { forgotPasswordToken };
  }

  //! VERIFY FORGOT PASSWORD
  async verifyForgotPassword(verifyUserDto: VerifyUserDto) {
    const { token, phoneNumber } = verifyUserDto;

    // find user
    const userFilter = { verified: true, phoneNumber };
    const user = await this.findUser(userFilter);

    // validate verification token
    const verifyFilter = {
      user: user._id,
      expiration: { $gt: new Date() },
      used: false,
      token,
    };

    const forgotPassword = await this.validateForgotPassword(
      verifyFilter,
      'verify token is invalid',
    );

    // set forgot password as used
    await this.setForgotPasswordAsUsed(forgotPassword);

    // return success message
    return 'please change your password';
  }

  //! RESET PASSWORD
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    request: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { password, phoneNumber } = resetPasswordDto;

    // find user
    const user = await this.findUser({ verified: true, phoneNumber });

    // validate forgot password instance
    const filter = { user: user._id, used: true, expiration: { $gt: new Date() } };
    await this.validateForgotPassword(filter, 'please verify again');

    // change password
    user.password = password;
    await user.save();

    return await this.generateTokens(request, user._id);
  }

  //! CHANGE MY PASSWORD
  async changeMyPassword(
    changePasswordDto: ChangePasswordDto,
    request: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { previousPassword, newPassword } = changePasswordDto;

    // find user
    let user: any = request.user;
    user = await this.userModel.findById(user._id).select('+password');
    if (!user) throw new NotFoundException('user not found');

    // validate previous password
    if (!(await user.validatePassword(previousPassword)))
      throw new BadRequestException('The previous password is incorrect');

    // change the password
    user.password = newPassword;
    await user.save();

    // return access token and refresh access token
    return await this.generateTokens(request, user._id);
  }

  /**
   **PRIVATE METHODS
   */

  //! FIND USER BY FILTER
  private async findUser<T extends object>(filter: T): Promise<UserDocument> {
    const user = await this.userModel.findOne(filter).select('+password +verified');

    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  //! SET VERIFICATION INFO
  private async setVerifyInfo(user: UserDocument): Promise<void> {
    user.verificationCode = this.generateRandomToken();
    user.verificationExpiration = addHours(
      Date.now(),
      globalConst.VERIFICATION_EXPIRATION,
    );

    await user.save();
  }

  //! GENERATE REFRESH ACCESS TOKEN
  private async generateRefreshToken(
    request: Request,
    user_id: UserDocument,
  ): Promise<string> {
    const refreshToken = await this.refreshTokenModel.create({
      user: user_id,
      refreshToken: uuidv4(),
      ip: getClientIp(request),
      agent: request.headers['user-agent'] || 'xxxx',
    });
    return refreshToken.refreshToken;
  }

  //! CREATE FORGOT PASSWORD INSTANCE
  private async createForgotPassword(
    user: UserDocument,
    request: Request,
  ): Promise<number> {
    const forgotPassword = await this.forgotPasswordModel.create({
      user,
      token: this.generateRandomToken(),
      expiration: addMinutes(Date.now(), 30),
      ip: getClientIp(request),
      agent: request.headers['user-agent'] || 'xxxx',
      used: false,
    });

    return forgotPassword.token;
  }

  //! VALIDATE FORGOT PASSWORD
  private async validateForgotPassword<T extends object, U extends string>(
    filter: T,
    message: U,
  ) {
    const result = await this.forgotPasswordModel.findOne(filter);
    if (!result) throw new BadRequestException(message);

    return result;
  }

  //! SET FORGOT PASSWORD AS USED
  private async setForgotPasswordAsUsed(
    forgotPassword: ForgotPasswordDocument,
  ): Promise<void> {
    forgotPassword.used = true;
    await forgotPassword.save();
  }

  //! RETURN ACCESS TOKEN AND REFRESH ACCESS TOKEN
  private async generateTokens(request: Request, userId: UserDocument) {
    return {
      accessToken: await this.singToken(userId),
      refreshToken: await this.generateRefreshToken(request, userId),
    };
  }

  //! GENERATE JWT
  private async singToken(userId: UserDocument): Promise<string> {
    const payload: JwtPayload = { id: userId };

    return await this.jwtService.signAsync(payload);
  }

  //! GENERATE 6-DIGIT RANDOM NUMBER
  private generateRandomToken(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private async checkUserPreExistence(signupDto: SignupDto) {
    const { username, phoneNumber } = signupDto;

    const user = await this.userModel.findOne({ $or: [{ username }, { phoneNumber }] });

    if (user)
      throw new BadRequestException(
        'the entered username or phone number already exists ',
      );
  }
}
