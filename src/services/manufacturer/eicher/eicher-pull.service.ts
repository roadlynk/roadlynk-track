import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Manufacturer } from '../../../schemas/fleet/truck.schema';
import { TruckLocation } from '../../../interfaces/truck-location.interface';
import { plainToInstance } from 'class-transformer';
import { HttpClientService } from '../../configuration/http-client.service';
import { ApiDetailsService } from '../../configuration/api-details.service';
import { parseLastUpdated } from '../../../common/date-time/eicher.util';
import { EicherLocationResponseDto } from '../../../dto/location/manufacturer/eicher/eicher-location-response.dto';
import { AuthUserContext } from '../../../common/authorization/company-access.util';
import { errorCode } from '../../../common/error.index';

interface EicherApiConfig {
  apiKey: string;
  tokenUrl: string;
  locationUrl: string;
  clientId: string;
}

@Injectable()
export class EicherPullService {
  constructor(
    private readonly apiDetailsService: ApiDetailsService,
    private readonly httpClientService: HttpClientService,
  ) {}

  async getLocations(
    truckNumbers: string[],
    companyId: string,
    user: AuthUserContext,
  ): Promise<TruckLocation[]> {
    if (truckNumbers.length === 0) {
      return [];
    }

    const { apiKey, tokenUrl, locationUrl, clientId } =
      await this.getApiConfig(companyId, user);

    const token = await this.requestToken(tokenUrl, apiKey);
    const locationResponse = await this.requestLocations(
      locationUrl,
      apiKey,
      clientId,
      token,
      truckNumbers,
    );

    if (
      locationResponse.errorMessage &&
      locationResponse.errorMessage.toLowerCase() !== 'none'
    ) {
      throw new BadGatewayException({
        message: `Eicher location endpoint returned an error: ${locationResponse.errorMessage}`,
        error_code: errorCode.eicher.locationError,
      });
    }

    if (!Array.isArray(locationResponse.locationData)) {
      throw new BadGatewayException({
        message: 'Eicher location response did not include locationData',
        error_code: errorCode.eicher.locationDataMissing,
      });
    }

    const receivedAt = new Date();

    return locationResponse.locationData.map((location) => {
      const epochDate =
        location.epochTime === undefined
          ? null
          : new Date(location.epochTime * 1000);
      const capturedAt =
        (epochDate && Number.isFinite(epochDate.getTime())
          ? epochDate
          : null) ??
        parseLastUpdated(location.lastUpdated) ??
        receivedAt;

      return {
        truckNumber: location.regNo ?? '',
        manufacturer: Manufacturer.EICHER,
        latitude: this.toNumber(location.latitude),
        longitude: this.toNumber(location.longitude),
        odometer: this.toNumber(location.odometer),
        vehicleStatus:
          typeof location.vehicleStatus === 'string'
            ? location.vehicleStatus
            : null,
        speed: this.toNumber(location.vehicleSpeed),
        capturedAt,
      };
    });
  }

  private async getApiConfig(
    companyId: string,
    user: AuthUserContext,
  ): Promise<EicherApiConfig> {
    const apiDetails = await this.apiDetailsService.findByManufacturerAndCompany(
      Manufacturer.EICHER,
      companyId,
      user,
    );
    const apiKey = apiDetails.apiCredentials.get('EICHER_API_KEY');
    const tokenUrl = apiDetails.apiCredentials.get('EICHER_TOKEN_URL');
    const locationUrl = apiDetails.apiCredentials.get('EICHER_LOCATION_URL');
    const clientId = apiKey;

    if (!apiKey || !tokenUrl || !clientId || !locationUrl) {
      throw new ServiceUnavailableException({
        message: 'Eicher token URL, API key, or client ID is not configured',
        error_code: errorCode.eicher.configurationMissing,
      });
    }

    return { apiKey, tokenUrl, locationUrl, clientId };
  }

  private async requestToken(tokenUrl: string, apiKey: string): Promise<string> {
    const response = await this.httpClientService.request(
      tokenUrl,
      {
        method: 'GET',
        headers: {
          'API-KEY': apiKey,
          Accept: 'application/json',
        },
      },
      'Eicher token endpoint',
    );

    let tokenResponse: unknown;
    try {
      tokenResponse = await response.json();
    } catch {
      throw new BadGatewayException({
        message: 'Eicher token endpoint returned invalid JSON',
        error_code: errorCode.eicher.tokenResponseInvalid,
      });
    }

    const token = this.extractToken(tokenResponse);

    if (!token) {
      throw new BadGatewayException({
        message: 'Eicher token response did not include an access token',
        error_code: errorCode.eicher.accessTokenMissing,
      });
    }

    return token;
  }

  private async requestLocations(
    locationUrl: string,
    apiKey: string,
    clientId: string,
    token: string,
    truckNumbers: string[],
  ): Promise<EicherLocationResponseDto> {
    const response = await this.httpClientService.request(
      locationUrl,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'API-KEY': apiKey,
          Authorization: `Bearer ${token}`,
          'X-IBM-Client-Id': clientId,
        },
        body: JSON.stringify({ regNo: truckNumbers }),
      },
      'Eicher location endpoint',
    );

    try {
      const responseBody: unknown = await response.json();
      return plainToInstance(EicherLocationResponseDto, responseBody);
    } catch {
      throw new BadGatewayException({
        message: 'Eicher location endpoint returned invalid JSON',
        error_code: errorCode.eicher.locationResponseInvalid,
      });
    }
  }

  private extractToken(response: unknown): string | undefined {
    if (typeof response === 'string') {
      return response.trim() || undefined;
    }

    if (typeof response !== 'object' || response === null) {
      return undefined;
    }

    const tokenKeys = ['access_token', 'accessToken', 'token'];
    const record = response as Record<string, unknown>;

    for (const key of tokenKeys) {
      if (typeof record[key] === 'string') {
        return record[key] as string;
      }
    }

    for (const key of ['data', 'result']) {
      const nestedToken = this.extractToken(record[key]);
      if (nestedToken) {
        return nestedToken;
      }
    }

    return undefined;
  }

  private toNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  }
}