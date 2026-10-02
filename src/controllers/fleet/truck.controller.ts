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
import { CreateTruckDto } from '../../dto/fleet/truck/create-truck.dto';
import { UpdateTruckDto } from '../../dto/fleet/truck/update-truck.dto';
import { TruckService } from '../../services/fleet/truck.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../schemas/auth-users/user.schema';

@Controller('trucks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CLIENT_ADMIN)
export class TruckController {
  constructor(private readonly truckService: TruckService) {}

  @Post()
  create(@Body() dto: CreateTruckDto, @Request() req: any) {
    return this.truckService.create(dto, req.user);
  }

  @Get('company/:companyId')
  findByCompanyId(
    @Param('companyId') companyId: string,
    @Request() req: any,
  ) {
    return this.truckService.findAll(companyId, req.user);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Request() req: any) {
    return this.truckService.findById(id, req.user);
  }

  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @Body() dto: UpdateTruckDto,
    @Request() req: any,
  ) {
    return this.truckService.updateById(id, dto, req.user);
  }
}