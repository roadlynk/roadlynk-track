import {
  BadGatewayException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { errorCode } from './error.index';

interface OsrmRouteResponse {
  code?: string;
  routes?: Array<{
    distance?: number;
    duration?: number;
  }>;
}

export interface OsrmDistanceResult {
  distanceMeters: number;
  distanceKm: number;
  durationSeconds: number;
  durationMinutes: number;
  durationText: string;
}

export async function getOsrmDistance(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number,
): Promise<OsrmDistanceResult> {
  const coordinates = [
    [fromLatitude, fromLongitude],
    [toLatitude, toLongitude],
  ];

  if (
    coordinates.some(
      ([latitude, longitude]) =>
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180,
    )
  ) {
    throw new BadRequestException({
      message: 'Delivery coordinates are invalid',
      error_code: errorCode.apiCommon.badRequest,
    });
  }

  const baseUrl = process.env.OSRM_BASE_URL?.replace(/\/+$/, '');
  if (!baseUrl) {
    throw new InternalServerErrorException({
      message: 'OSRM_BASE_URL is not configured',
      error_code: errorCode.apiCommon.internalServerError,
    });
  }

  const url = `${baseUrl}/${fromLongitude},${fromLatitude};${toLongitude},${toLatitude}?overview=false`;

  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  } catch {
    throw new BadGatewayException({
      message: 'Unable to reach the OSRM routing service',
      error_code: errorCode.apiCommon.internalServerError,
    });
  }

  if (!response.ok) {
    throw new BadGatewayException({
      message: `OSRM returned status ${response.status}`,
      error_code: errorCode.apiCommon.internalServerError,
    });
  }

  let data: OsrmRouteResponse;
  try {
    data = (await response.json()) as OsrmRouteResponse;
  } catch {
    throw new BadGatewayException({
      message: 'OSRM returned an invalid response',
      error_code: errorCode.apiCommon.internalServerError,
    });
  }

  const route = data.routes?.[0];
  if (
    data.code !== 'Ok' ||
    !route ||
    !Number.isFinite(route.distance) ||
    !Number.isFinite(route.duration)
  ) {
    throw new BadGatewayException({
      message: 'OSRM could not find a route between the deliveries',
      error_code: errorCode.apiCommon.internalServerError,
    });
  }

  const distanceMeters = route.distance!;
  const durationSeconds = route.duration!;
  const totalMinutes = Math.round(durationSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const durationText = [
    hours > 0 ? `${hours} hour${hours === 1 ? '' : 's'}` : '',
    minutes > 0 ? `${minutes} minute${minutes === 1 ? '' : 's'}` : '',
  ]
    .filter(Boolean)
    .join(' ') || '0 minutes';

  return {
    distanceMeters,
    distanceKm: Number((distanceMeters / 1000).toFixed(2)),
    durationSeconds,
    durationMinutes: durationSeconds / 60,
    durationText,
  };
}
