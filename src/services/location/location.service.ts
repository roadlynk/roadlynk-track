import { Injectable } from '@nestjs/common';
import { TruckLocation } from '../../interfaces/truck-location.interface';
import { Manufacturer, TruckDocument } from '../../schemas/fleet/truck.schema';
import { TruckRepository } from '../../repositories/fleet/truck.repository';
import { EicherPullService } from '../manufacturer/eicher/eicher-pull.service';
import { AuthUserContext, validateCompanyAccess } from '../../common/authorization/company-access.util';
import { validateObjectId } from '../../common/validation/mongo-id.util';
import { PullLocationRepository } from '../../repositories/location/pull-location.repository';

@Injectable()
export class LocationService {
  constructor(
    private readonly truckRepository: TruckRepository,
    private readonly eicherPullService: EicherPullService,
    private readonly pullLocationRepository: PullLocationRepository,
  ) {}

  async getLocations(
    companyId: string,
    truckNumbers: string[] = [],
    user: AuthUserContext,
  ) {
    validateObjectId(companyId, 'company id');
    validateCompanyAccess(user, companyId);

    const trucksByManufacturer = await this.groupTrucksByManufacturer(
      companyId,
      truckNumbers,
    );
    
    const locationsByManufacturer = this.createManufacturerGroups<TruckLocation>();

    for (const manufacturer of Object.values(Manufacturer)) {
      const manufacturerTrucks = trucksByManufacturer[manufacturer];

      if (
        manufacturer === Manufacturer.EICHER &&
        manufacturerTrucks.length > 0
      ) {
        locationsByManufacturer[manufacturer] =
          await this.eicherPullService.getLocations(
            manufacturerTrucks.map((truck) => truck.truckNumber),
            companyId,
            user,
          );
      }
    }

    return locationsByManufacturer;
  }

  async refreshAndSaveCompanyLocations(
    companyId: string,
    user: AuthUserContext,
  ) {
    const locationsByManufacturer = await this.getLocations(companyId, [], user);
    const locations = Object.values(locationsByManufacturer).flat();
    await this.pullLocationRepository.createSnapshots(companyId, locations);
    return locations.length;
  }

  private async groupTrucksByManufacturer(
    companyId: string,
    truckNumbers: string[],
  ) {
    const normalizedTruckNumbers = [
      ...new Set(
        truckNumbers.map((truckNumber) =>
          this.normalizeTruckNumber(truckNumber),
        ),
      ),
    ];
    const trucks = normalizedTruckNumbers.length
      ? await this.truckRepository.findByTruckNumbers(
          normalizedTruckNumbers,
          companyId,
        )
      : await this.truckRepository.findAll(companyId);
    const trucksByManufacturer = this.createManufacturerGroups<TruckDocument>();

    for (const truck of trucks) {
      trucksByManufacturer[truck.manufacturer].push(truck);
    }

    return trucksByManufacturer;
  }

  private createManufacturerGroups<T>() {
    return Object.values(Manufacturer).reduce(
      (groups, manufacturer) => {
        groups[manufacturer] = [];
        return groups;
      },
      {} as Record<Manufacturer, T[]>,
    );
  }

  private normalizeTruckNumber(truckNumber: string) {
    return truckNumber.trim().toUpperCase();
  }
}