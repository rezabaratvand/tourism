import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/users/schema/user.schema';
import { DataGeneratorService } from './data-generator.service';

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
  providers: [DataGeneratorService],
})
export class DataGeneratorModule {}
