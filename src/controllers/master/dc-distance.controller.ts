import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../schemas/auth-users/user.schema';
import { CreateDCDistanceDto } from '../../dto/master/dc-distance/create-dc-distance.dto';
import { UpdateDCDistanceDto } from '../../dto/master/dc-distance/update-dc-distance.dto';
import { GetDistanceDto } from '../../dto/master/dc-distance/get-distance.dto';
import { DCDistanceService } from '../../services/master/dc-distance.service';

@Controller('dc-distances')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CLIENT_ADMIN)
export class DCDistanceController {
  constructor(private readonly dcDistanceService: DCDistanceService) {}

  @Post()
  create(@Body() dto: CreateDCDistanceDto, @Request() req: any) {
    return this.dcDistanceService.create(dto, req.user);
  }

  @Post('distance')
  @HttpCode(HttpStatus.OK)
  getDistance(@Body() dto: GetDistanceDto, @Request() req: any) {
    return this.dcDistanceService.getDistance(dto, req.user);
  }

  @Post('company/distance/:companyId')
  @HttpCode(HttpStatus.OK)
  getDistanceByCompany(
    @Param('companyId') companyId: string,
    @Body() dto: GetDistanceDto,
    @Request() req: any,
  ) {
    return this.dcDistanceService.getDistance(dto, req.user, companyId);
  }

  @Get('company/:companyId')
  findByCompanyId(
    @Param('companyId') companyId: string,
    @Request() req: any,
  ) {
    return this.dcDistanceService.findAll(companyId, req.user);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Request() req: any) {
    return this.dcDistanceService.findById(id, req.user);
  }

  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @Body() dto: UpdateDCDistanceDto,
    @Request() req: any,
  ) {
    return this.dcDistanceService.updateById(id, dto, req.user);
  }
}
