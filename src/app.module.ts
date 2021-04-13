import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/exception-filter.exception';
import { ToursModule } from './modules/tours/tours.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { DataTransformInterceptor } from './interceptors/data-transformer.interceptor';
import { DataGeneratorModule } from './modules/data-generator/data-generator.module';
import { HelperModule } from './modules/helper/helper.module';
import { CommentsModule } from './modules/comments/comments.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import * as paginatePlugin from 'mongoose-paginate-v2';

@Module({
  imports: [
    // UsersModule,
    ToursModule,
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: 'mongodb://localhost:27017/tourism',
        connectionName: 'tourism',
        useCreateIndex: true,
        useNewUrlParser: true,
        connectionFactory: connection => {
          connection.plugin(paginatePlugin);
          return connection;
        },
      }),
    }),
    // throttler module
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: 60,
        limit: 30,
      }),
    }),
    AuthModule,
    DataGeneratorModule,
    HelperModule,
    CommentsModule,
    BookingsModule,
    // call register method on config module
    // ConfigModule.register({ folder: './config' }),
  ],
  controllers: [AppController],
  providers: [
    // use global-scoped filter
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // throttler binding
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // set jwt guard globally
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // data transformer interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: DataTransformInterceptor,
    },
  ],
})
export class AppModule {}
