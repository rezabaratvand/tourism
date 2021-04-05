import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { addHours } from 'date-fns';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
import { JwtPayload } from './jwt-payload.interfaces';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import globalConst from 'src/common/constants/global.const';
import { VerifyUserDto } from './dto/verify-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  //! SIGNIN USER
  async signin(signinDto: SigninDto): Promise<{ accessToken: string }> {
    const { username, password } = signinDto;
    const filter = { username, verified: true };

    const user: any = await this.userModel.findOne(filter);

    /**
     //? it must refactor and move to a separate method like: 'validateUserInfo' .
     */
    if (!user || !(await user.validatePassword(password)))
      throw new UnauthorizedException('the username/password is invalid');

    //! issuing new jwt
    return { accessToken: await this.singToken(user._id) };
  }

  //! SIGNUP NEW USER
  async signup(signupDto: SignupDto): Promise<{ verifyToken: number }> {
    const { username, password, fullName, phoneNumber } = signupDto;
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

  async verifyUser(verifyUserDto: VerifyUserDto): Promise<{ accessToken: string }> {
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

    return { accessToken: await this.singToken(user._id) };
  }

  /**
   **PRIVATE METHODS
   */
  //! SET VERIFICATION INFO
  private async setVerifyInfo(user: UserDocument): Promise<void> {
    user.verificationCode = this.generateRandomToken();
    user.verificationExpiration = addHours(
      Date.now(),
      globalConst.VERIFICATION_EXPIRATION,
    );

    await user.save();
  }

  //! GENERATE JWT
  private async singToken(userId: string): Promise<string> {
    const payload: JwtPayload = { id: userId };

    return await this.jwtService.signAsync(payload);
  }

  //! GENERATE 6-DIGIT RANDOM NUMBER
  private generateRandomToken(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
