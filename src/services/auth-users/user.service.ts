import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { CreateUserDto } from '../../dto/auth-users/create-user.dto';
import { LoginDto } from '../../dto/auth-users/login.dto';
import { RefreshTokenDto } from '../../dto/auth-users/refresh-token.dto';
import { ChangePasswordDto } from '../../dto/auth-users/change-password.dto';
import { UpdateUserDto } from '../../dto/auth-users/update-user.dto';
import { UserRepository } from '../../repositories/auth-users/user.repository';
import { validateObjectId } from '../../common/validation/mongo-id.util';
import { errorCode } from '../../common/error.index';
import { UserRole } from '../../schemas/auth-users/user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateUserDto) {
    if (dto.userRole === UserRole.ADMIN) {
      if (dto.companyId) {
        validateObjectId(dto.companyId, 'company id');
      }
    } else {
      if (!dto.companyId) {
        throw new BadRequestException({
          message: 'companyId is required for non-admin users',
          error_code: errorCode.apiCommon.badRequest,
        });
      }
      validateObjectId(dto.companyId, 'company id');
    }

    const saltRounds = this.getSaltRounds();
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const { password, companyId, ...userData } = dto;

    try {
      const createdUser = await this.userRepository.create({
        ...userData,
        ...(dto.userRole === UserRole.ADMIN && !companyId
          ? {}
          : companyId
            ? { companyId: new Types.ObjectId(companyId) }
            : {}),
        passwordHash,
      });

      return createdUser.toJSON();
    } catch (error) {
      this.throwIfDuplicateKey(error);
    }
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmailWithPassword(dto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        error_code: errorCode.auth.invalidCredentials,
      });
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        error_code: errorCode.auth.invalidCredentials,
      });
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.userRole,
      userRole: user.userRole,
      companyId: user.companyId ? user.companyId.toString() : null,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = await this.signAccessToken(payload);
    const refreshToken = await this.signRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: user.toJSON(),
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    let decoded: any;
    try {
      decoded = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException({
        message: 'Invalid or expired refresh token',
        error_code: errorCode.auth.invalidRefreshToken,
      });
    }

    const user = await this.userRepository.findById(decoded.sub);
    if (!user || !user.isActive || user.tokenVersion !== decoded.tokenVersion) {
      throw new UnauthorizedException({
        message: 'Invalid refresh token',
        error_code: errorCode.auth.invalidRefreshToken,
      });
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.userRole,
      userRole: user.userRole,
      companyId: user.companyId ? user.companyId.toString() : null,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = await this.signAccessToken(payload);
    const refreshToken = await this.signRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getMe(userId: string) {
    validateObjectId(userId, 'user id');
    const user = await this.userRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new NotFoundException({
        message: 'User not found',
        error_code: errorCode.auth.userNotFound,
      });
    }

    return user.toJSON();
  }

  async findAll(companyId?: string) {
    if (companyId) {
      validateObjectId(companyId, 'company id');
    }
    return this.userRepository.findAll(companyId);
  }

  async logout(userId: string) {
    validateObjectId(userId, 'user id');
    await this.userRepository.revokeTokens(userId);
    return {
      message: 'Logged out successfully',
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    validateObjectId(userId, 'user id');

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException({
        message: `User with id '${userId}' not found`,
        error_code: errorCode.auth.userNotFound,
      });
    }

    const saltRounds = this.getSaltRounds();
    const passwordHash = await bcrypt.hash(dto.newPassword, saltRounds);

    await this.userRepository.updatePassword(userId, passwordHash);

    return {
      message: 'Password updated successfully',
    };
  }

  async updateById(userId: string, dto: UpdateUserDto) {
    validateObjectId(userId, 'user id');

    if (dto.companyId) {
      validateObjectId(dto.companyId, 'company id');
    }

    const { companyId, ...rest } = dto;
    const updatePayload: Record<string, any> = { ...rest };

    if (companyId !== undefined) {
      updatePayload.companyId = companyId ? new Types.ObjectId(companyId) : null;
    }

    try {
      const updatedUser = await this.userRepository.updateById(
        userId,
        updatePayload,
      );

      if (!updatedUser) {
        throw new NotFoundException({
          message: `User with id '${userId}' not found`,
          error_code: errorCode.auth.userNotFound,
        });
      }

      return updatedUser.toJSON();
    } catch (error) {
      this.throwIfDuplicateKey(error);
    }
  }

  private getSaltRounds(): number {
    const rounds = Number(this.configService.get<string>('BCRYPT_SALT_ROUNDS', '10'));
    return Number.isInteger(rounds) && rounds > 0 ? rounds : 10;
  }

  private signAccessToken(payload: Record<string, any>) {
    const accessSecret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    const accessExpiresIn = (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '12h') as any;

    return this.jwtService.signAsync(payload, {
      secret: accessSecret,
      expiresIn: accessExpiresIn,
    });
  }

  private signRefreshToken(payload: Record<string, any>) {
    const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    const refreshExpiresIn = (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d') as any;

    return this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });
  }

  private throwIfDuplicateKey(error: unknown): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      throw new ConflictException({
        message: 'A user with this email already exists',
        error_code: errorCode.auth.userAlreadyExists,
      });
    }

    throw error;
  }
}
