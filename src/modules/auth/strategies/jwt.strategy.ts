import { UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User, UserDocument } from '../../users/schema/user.schema';
import jwtConstant from '../constants/auth.constants';
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstant.secret,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<UserDocument> {
    const user = await this.userModel.findById(jwtPayload.id);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
