import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateDriverDto } from '../../dto/fleet/driver/create-driver.dto';
import { UpdateDriverDto } from '../../dto/fleet/driver/update-driver.dto';
import { DriverService } from '../../services/fleet/driver.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../schemas/auth-users/user.schema';

@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CLIENT_ADMIN)
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  create(@Body() dto: CreateDriverDto, @Request() req: any) {
    return this.driverService.create(dto, req.user);
  }

  @Get('company/:companyId')
  findByCompanyId(
    @Param('companyId') companyId: string,
    @Request() req: any,
  ) {
    return this.driverService.findAll(companyId, req.user);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Request() req: any) {
    return this.driverService.findById(id, req.user);
  }

  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @Body() dto: UpdateDriverDto,
    @Request() req: any,
  ) {
    return this.driverService.updateById(id, dto, req.user);
  }
}
