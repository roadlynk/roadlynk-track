import {
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TruckLocation } from '../../../interfaces/truck-location.interface';
import { CompanyRepository } from '../../../repositories/fleet/company.repository';
import { Manufacturer } from '../../../schemas/fleet/truck.schema';
import { PushLocationRepository } from '../../../repositories/location/push-location.repository';
import {
	EicherLocationPushDataDto,
	EicherLocationPushDto,
} from '../../../dto/location/manufacturer/eicher/eicher-location-push.dto';
import { parseLastUpdated } from '../../../common/date-time/eicher.util';

@Injectable()
export class EicherPushService {
	private readonly logger = new Logger(EicherPushService.name);

	constructor(
		private readonly locationRepository: PushLocationRepository,
		private readonly companyRepository: CompanyRepository,
	) {}

	async processPush(companyCode: string, payload: EicherLocationPushDto) {
		const company = await this.companyRepository.findByCompanyCode(companyCode);
		if (!company) {
			throw new NotFoundException('Company not found');
		}

		const receivedAt = new Date();
		const records = Array.isArray(payload.locationData)
			? payload.locationData
			: [];
		const locations: TruckLocation[] = [];

		for (const [index, record] of records.entries()) {
			if (!record || typeof record !== 'object' || Array.isArray(record)) {
				this.logger.warn(`Skipped malformed Eicher location record at index ${index}`);
				continue;
			}

			const location = plainToInstance(EicherLocationPushDataDto, record);
			const errors = await validate(location, {
				whitelist: true,
				forbidNonWhitelisted: true,
			});
			const truckNumber = location.regNo?.trim().toUpperCase();

			if (errors.length > 0 || !truckNumber) {
				this.logger.warn(`Skipped malformed Eicher location record at index ${index}`);
				continue;
			}

			locations.push({
				truckNumber,
				manufacturer: Manufacturer.EICHER,
				latitude: this.toFiniteNumber(location.latitude),
				longitude: this.toFiniteNumber(location.longitude),
				odometer: this.toFiniteNumber(location.odometer),
				vehicleStatus: location.vehicleStatus ?? null,
				speed: this.toFiniteNumber(location.vehicleSpeed),
				capturedAt: this.getCapturedAt(location, receivedAt),
			});
		}

		try {
			const saved = await this.locationRepository.createPushLocationSnapshots(
				locations,
				company._id,
			);
			return {
				status: true,
				message: 'Location data received successfully',
				recordsReceived: records.length,
				recordsSaved: saved.length,
			};
		} catch (error) {
			const errorName = error instanceof Error ? error.name : 'UnknownError';
			this.logger.error(`Eicher location push persistence failed (${errorName})`);
			throw new InternalServerErrorException(
				'Unable to process Eicher location data',
			);
		}
	}

	private getCapturedAt(
		location: EicherLocationPushDataDto,
		receivedAt: Date,
	): Date {
		if (location.epochTime !== undefined) {
			const epochDate = new Date(location.epochTime * 1000);
			if (Number.isFinite(epochDate.getTime())) {
				return epochDate;
			}
		}

		return parseLastUpdated(location.lastUpdated) ?? receivedAt;
	}

	private toFiniteNumber(value?: number): number | null {
		return typeof value === 'number' && Number.isFinite(value) ? value : null;
	}
}