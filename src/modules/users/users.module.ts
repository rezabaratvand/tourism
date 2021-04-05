import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LoggerMiddleware } from '../../middleware/class-base.middleware';
import { newLogger } from 'src/middleware/function-base.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';

@Module({
  imports: [
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
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, newLogger)
      // .exclude({ path: 'users', method: RequestMethod.DELETE })
      .forRoutes(UsersController);
    // .forRoutes('users');
    // .forRoutes({ path: 'users', method: RequestMethod.GET });
  }
}
