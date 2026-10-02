import { Global, Module } from '@nestjs/common';
import { HttpClientService } from '../../services/configuration/http-client.service';

@Global()
@Module({
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class HttpClientModule {}