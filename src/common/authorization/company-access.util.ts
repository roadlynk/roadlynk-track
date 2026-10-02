import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { errorCode } from '../error.index';
import { UserRole } from '../../schemas/auth-users/user.schema';

export interface AuthUserContext {
  sub?: string;
  email?: string;
  role?: UserRole;
  userRole?: UserRole;
  companyId?: string | Types.ObjectId | null;
  [key: string]: any;
}

/**
 * Validates that the authenticated user is allowed to access/modify a resource belonging to a specific company.
 * - If user is ADMIN, access is automatically granted.
 * - If user's companyId matches the resourceCompanyId, access is granted.
 * - Otherwise, throws ForbiddenException.
 */
export function validateCompanyAccess(
  user: AuthUserContext | undefined | null,
  resourceCompanyId: string | Types.ObjectId | undefined | null,
): void {
  if (!user) {
    throw new UnauthorizedException({
      message: 'User is not authenticated',
      error_code: errorCode.apiCommon.unauthorized,
    });
  }

  const role = user.role ?? user.userRole;
  if (role === UserRole.ADMIN) {
    return;
  }

  const userCompanyId = user.companyId ? user.companyId.toString() : null;
  const targetCompanyId = resourceCompanyId ? resourceCompanyId.toString() : null;

  if (!userCompanyId || !targetCompanyId || userCompanyId !== targetCompanyId) {
    throw new ForbiddenException({
      message: 'You are not authorized to access this resource',
      error_code: errorCode.apiCommon.forbidden,
    });
  }
}
