import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { TrucksLocationDto } from '../../dto/location/truck-location.dto';
import { LocationService } from '../../services/location/location.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../schemas/auth-users/user.schema';

@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CLIENT_ADMIN)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('trucks')
  getLocations(@Body() dto: TrucksLocationDto, @Request() req: any) {
    return this.locationService.getLocations(
      dto.companyId,
      dto.truckNumbers ?? [],
      req.user,
    );
  }
}