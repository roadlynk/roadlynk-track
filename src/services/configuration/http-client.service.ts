import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { errorCode } from '../../common/error.index';

@Injectable()
export class HttpClientService {
  async request(
    url: string,
    init: RequestInit,
    endpointName: string,
    timeoutMs = 10_000,
  ): Promise<Response> {
    let response: Response;
    try {
      response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch {
      throw new BadGatewayException({
        message: `Unable to reach the ${endpointName}`,
        error_code: errorCode.apiCommon.internalServerError,
      });
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      throw new HttpException(
        {
          message: `${endpointName} rate limit exceeded`,
          error_code: errorCode.apiCommon.rateLimited,
          ...(retryAfter ? { retryAfter } : {}),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (!response.ok) {
      const allowedMethods = response.headers.get('allow');
      throw new BadGatewayException({
        message: `${endpointName} returned status ${response.status} for ${init.method ?? 'GET'}${
          allowedMethods ? `. Allowed methods: ${allowedMethods}` : ''
        }`,
        error_code: errorCode.apiCommon.internalServerError,
      });
    }

    return response;
  }
}