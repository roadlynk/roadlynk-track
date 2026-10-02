import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Manufacturer } from '../../schemas/fleet/truck.schema';
import { CreateApiDetailsDto } from '../../dto/configuration/api-details/create-api-details.dto';
import { UpdateApiDetailsDto } from '../../dto/configuration/api-details/update-api-details.dto';
import { ApiDetailsService } from '../../services/configuration/api-details.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../schemas/auth-users/user.schema';

@Controller('api-details')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CLIENT_ADMIN)
export class ApiDetailsController {
  constructor(private readonly apiDetailsService: ApiDetailsService) {}

  @Post()
  create(@Body() dto: CreateApiDetailsDto, @Request() req: any,) {
    return this.apiDetailsService.create(dto, req.user);
  }

  @Get('company/:companyId')
  findAll(@Param('companyId') companyId: string, @Request() req: any,) {
    return this.apiDetailsService.findAll(companyId, req.user);
  }

  @Get('company/:companyId/manufacturer/:manufacturer')
  findByManufacturer(
    @Param('companyId') companyId: string,
    @Param('manufacturer', new ParseEnumPipe(Manufacturer))
    manufacturer: Manufacturer,
    @Request() req: any,
  ) {
    return this.apiDetailsService.findByManufacturerAndCompany(
      manufacturer,
      companyId,
      req.user
    );
  }

  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @Body() dto: UpdateApiDetailsDto,
    @Request() req: any,
  ) {
    return this.apiDetailsService.updateById(id, dto, req.user);
  }
}