import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCompanyDto } from '../../dto/fleet/company/create-company.dto';
import { UpdateCompanyDto } from '../../dto/fleet/company/update-company.dto';
import { CompanyService } from '../../services/fleet/company.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../schemas/auth-users/user.schema';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() dto: CreateCompanyDto) {
    return this.companyService.create(dto);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.companyService.findById(id);
  }

  @Patch(':id')
  updateById(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.companyService.updateById(id, dto);
  }
}
