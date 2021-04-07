import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import jwtConstant from './constants/auth.constants';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schema/user.schema';

@Module({
  imports: [
    UsersModule,
    PassportModule.registerAsync({
      useFactory: () => ({ defaultStrategy: 'jwt' }),
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: jwtConstant.secret,
        signOptions: {
          expiresIn: jwtConstant.expiresIn,
        },
      }),
    }),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
