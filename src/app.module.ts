import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/exception-filter.exception';
import { ToursModule } from './modules/tours/tours.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    ToursModule,
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URI,
        connectionName: 'tourism',
        useCreateIndex: true,
        useNewUrlParser: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    // use global-scoped filter
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
