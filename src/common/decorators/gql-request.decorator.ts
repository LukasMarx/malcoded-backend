import { createParamDecorator } from '@nestjs/common';

export const GQLReq = createParamDecorator((data, [root, args, ctx, info]) => {
  return ctx.req;
});
