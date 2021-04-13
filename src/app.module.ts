import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/exception-filter.exception';
import { ToursModule } from './modules/tours/tours.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { DataGeneratorModule } from './modules/data-generator/data-generator.module';
import { HelperModule } from './modules/helper/helper.module';
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
  ],
})
export class AppModule {}
