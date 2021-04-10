import { IsMongoId, IsNotEmpty } from 'class-validator';
export class MongoIdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
