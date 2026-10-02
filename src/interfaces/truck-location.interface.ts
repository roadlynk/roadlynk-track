import { Manufacturer } from '../schemas/fleet/truck.schema';

export interface TruckLocation {
  truckNumber: string;
  manufacturer: Manufacturer;
  latitude: number | null;
  longitude: number | null;
  odometer: number | null;
  vehicleStatus: string | null;
  speed: number | null;
  capturedAt?: Date;
}