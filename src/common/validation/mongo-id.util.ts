import { BadRequestException } from '@nestjs/common';
import { errorCode } from '../error.index';

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export function isValidObjectId(id: string): boolean {
  return OBJECT_ID_REGEX.test(id);
}

export function validateObjectId(id: string, entityName = 'id'): void {
  if (!isValidObjectId(id)) {
    throw new BadRequestException({
      message: `Invalid ${entityName}`,
      error_code: errorCode.apiCommon.badRequest,
    });
  }
}
