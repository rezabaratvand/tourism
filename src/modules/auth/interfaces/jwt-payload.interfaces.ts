import { UserDocument } from 'src/modules/users/schema/user.schema';

export interface JwtPayload {
  id: UserDocument;
}
