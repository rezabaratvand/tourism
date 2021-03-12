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

@Module({
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
