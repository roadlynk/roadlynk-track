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
import { CreateClientDto } from '../../dto/master/client/create-client.dto';
import { UpdateClientDto } from '../../dto/master/client/update-client.dto';
import { ClientService } from '../../services/master/client.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../schemas/auth-users/user.schema';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CLIENT_ADMIN)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() dto: CreateClientDto, @Request() req: any) {
    return this.clientService.create(dto, req.user);
  }

  @Get('company/:companyId')
  findByCompanyId(
    @Param('companyId') companyId: string,
    @Request() req: any,
  ) {
    return this.clientService.findAll(companyId, req.user);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Request() req: any) {
    return this.clientService.findById(id, req.user);
  }

  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
    @Request() req: any,
  ) {
    return this.clientService.updateById(id, dto, req.user);
  }
}
