import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../schemas/auth-users/user.schema';
import { errorCode } from '../common/error.index';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required) return true;

    const { user } = context.switchToHttp().getRequest();
    const userRole = user?.role ?? user?.userRole;

    if (!required.includes(userRole)) {
      throw new ForbiddenException({
        message: 'You do not have permission to access this resource',
        error_code: errorCode.apiCommon.forbidden,
      });
    }

    return true;
  }
}
