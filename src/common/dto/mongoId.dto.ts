import { IsMongoId, IsNotEmpty } from 'class-validator';
import * as mongoose from 'mongoose';

export class MongoIdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: mongoose.Types.ObjectId;
}
