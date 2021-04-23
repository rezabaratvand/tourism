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
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { DataTransformInterceptor } from './interceptors/data-transformer.interceptor';
import { DataGeneratorModule } from './modules/data-generator/data-generator.module';
import { HelperModule } from './modules/helper/helper.module';
import { CommentsModule } from './modules/comments/comments.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import * as paginatePlugin from 'mongoose-paginate-v2';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import databaseConfig from 'config/database.config';
import authConfig from 'config/auth.config';

@Module({
  imports: [
    //! mongoose configuration
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        connectionName: configService.get<string>('database.connectionName'),
        useCreateIndex: true,
        useNewUrlParser: true,
        connectionFactory: connection => {
          connection.plugin(paginatePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    //! throttler module config
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: 60,
        limit: 30,
      }),
    }),
    //! config module configuration
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [databaseConfig, authConfig],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        JWT_EXPIRATION: Joi.alternatives().try(Joi.string(), Joi.number()),
        JWT_SECRET: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
      }),
      validationOptions: {
        // allowUnknown: false,
        abortEarly: true,
      },
    }),
    ToursModule,
    UsersModule,
    AuthModule,
    HelperModule,
    CommentsModule,
    BookingsModule,
    DataGeneratorModule,
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
