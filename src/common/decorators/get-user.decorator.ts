import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/users/schema/user.schema';

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: User = request.user;

  return data ? user[data] : user;
});
