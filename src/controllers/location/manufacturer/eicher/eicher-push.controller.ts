import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { EicherPushService } from '../../../../services/manufacturer/eicher/eicher-push.service';
import { EicherLocationPushDto } from '../../../../dto/location/manufacturer/eicher/eicher-location-push.dto';

@Controller('eicher/location')
export class EicherPushController {
  constructor(private readonly eicherPushService: EicherPushService) {}

  @Post('push/:companyCode')
  @HttpCode(HttpStatus.OK)
  processPush(
    @Param('companyCode') companyCode: string,
    @Body() payload: EicherLocationPushDto,
  ) {
    return this.eicherPushService.processPush(companyCode, payload);
  }
}