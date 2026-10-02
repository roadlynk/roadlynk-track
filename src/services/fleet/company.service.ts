import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompanyRepository } from '../../repositories/fleet/company.repository';
import { CreateCompanyDto } from '../../dto/fleet/company/create-company.dto';
import { UpdateCompanyDto } from '../../dto/fleet/company/update-company.dto';
import { validateObjectId } from '../../common/validation/mongo-id.util';
import { errorCode } from '../../common/error.index';
import { UserService } from '../auth-users/user.service';
import { UserRepository } from '../../repositories/auth-users/user.repository';
import { UserRole } from '../../schemas/auth-users/user.schema';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateCompanyDto) {
    const { isCompanyAdmin, ...companyData } = dto;

    try {
      const company = await this.companyRepository.create(companyData);

      const userRole = isCompanyAdmin ? UserRole.CLIENT_ADMIN : UserRole.CLIENT;
      const password = `${dto.companyName}_password`;

      await this.userService.create({
        username: dto.companyName,
        email: dto.contactEmail,
        password,
        companyId: company._id.toString(),
        userRole,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      });

      return company;
    } catch (error) {
      this.throwIfDuplicateKey(error);
    }
  }

  findAll() {
    return this.companyRepository.findAll();
  }

  async findById(id: string) {
    validateObjectId(id, 'company id');
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundException({
        message: `Company with id '${id}' not found`,
        error_code: errorCode.company.notFound,
      });
    }

    return company;
  }

  async updateById(id: string, dto: UpdateCompanyDto) {
    validateObjectId(id, 'company id');
    const { isCompanyAdmin, ...companyData } = dto;

    const existingCompany = await this.companyRepository.findById(id);
    if (!existingCompany) {
      throw new NotFoundException({
        message: `Company with id '${id}' not found`,
        error_code: errorCode.company.notFound,
      });
    }

    try {
      const company = await this.companyRepository.updateById(id, companyData);

      const userUpdate: Record<string, any> = {};
      if (dto.companyName) {
        userUpdate.username = dto.companyName;
      }
      if (dto.contactEmail) {
        userUpdate.email = dto.contactEmail.trim().toLowerCase();
      }
      if (isCompanyAdmin !== undefined) {
        userUpdate.userRole = isCompanyAdmin
          ? UserRole.CLIENT_ADMIN
          : UserRole.CLIENT;
      }

      if (Object.keys(userUpdate).length > 0) {
        const oldEmail = existingCompany.contactEmail.trim().toLowerCase();
        const existingUser = await this.userRepository.findByEmail(oldEmail);

        if (existingUser) {
          await this.userRepository.updateById(
            existingUser._id.toString(),
            userUpdate,
          );
        }
      }

      return company;
    } catch (error) {
      this.throwIfDuplicateKey(error);
    }
  }

  private throwIfDuplicateKey(error: unknown): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      throw new ConflictException({
        message: 'Company code, email, or contact number already exists',
        error_code: errorCode.company.alreadyExists,
      });
    }

    throw error;
  }
}
