import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const Company = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: { companyId: any } = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    const company = user.companyId;
    request.setHeaders('x-company', company);
    return company;
  },
);
