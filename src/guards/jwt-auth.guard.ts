import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repositories/auth-users/user.repository';
import { errorCode } from '../common/error.index';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        message: 'Missing or invalid authorization token',
        error_code: errorCode.auth.invalidToken,
      });
    }

    const token = authHeader.slice(7);

    try {
      const secret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
      const payload = await this.jwtService.verifyAsync(token, { secret });

      if (!payload?.sub) {
        throw new UnauthorizedException({
          message: 'Invalid token payload',
          error_code: errorCode.auth.invalidToken,
        });
      }

      const user = await this.userRepository.findById(payload.sub);
      if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
        throw new UnauthorizedException({
          message: 'Token has been revoked or expired',
          error_code: errorCode.auth.invalidToken,
        });
      }

      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException({
        message: 'Invalid or expired access token',
        error_code: errorCode.auth.invalidToken,
      });
    }
  }
}
