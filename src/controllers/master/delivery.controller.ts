import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateDeliveryDto } from '../../dto/master/delivery/create-delivery.dto';
import { UpdateDeliveryDto } from '../../dto/master/delivery/update-delivery.dto';
import { DeliveryService } from '../../services/master/delivery.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../schemas/auth-users/user.schema';

@Controller('deliveries')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CLIENT_ADMIN)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  create(@Body() dto: CreateDeliveryDto, @Request() req: any) {
    return this.deliveryService.create(dto, req.user);
  }

  @Get('distance/:fromDeliveryId/:toDeliveryId')
  calculateDistanceBetweenDeliveries(
    @Param('fromDeliveryId') fromDeliveryId: string,
    @Param('toDeliveryId') toDeliveryId: string,
    @Request() req: any,
  ) {
    return this.deliveryService.calculateDistanceBetweenDeliveries(
      fromDeliveryId,
      toDeliveryId,
      req.user,
    );
  }

  @Get('company/:companyId')
  findByCompanyId(
    @Param('companyId') companyId: string,
    @Query('clientId') clientId: string,
    @Request() req: any,
  ) {
    return this.deliveryService.findAll(companyId, req.user, clientId);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Request() req: any) {
    return this.deliveryService.findById(id, req.user);
  }

  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryDto,
    @Request() req: any,
  ) {
    return this.deliveryService.updateById(id, dto, req.user);
  }
}
