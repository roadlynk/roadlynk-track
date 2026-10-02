import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserRole } from '../../schemas/auth-users/user.schema';
import { CompanyRepository } from '../../repositories/fleet/company.repository';
import { LocationService } from './location.service';

@Injectable()
export class LocationCronService {
  private readonly logger = new Logger(LocationCronService.name);
  private isSyncing = false;

  constructor(
    private readonly locationService: LocationService,
    private readonly companyRepository: CompanyRepository,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncLocations() {
    if (this.isSyncing) {
      this.logger.warn(
        'Skipping location sync because the previous sync is still running',
      );
      return;
    }

    this.isSyncing = true;

    try {
      const companies = await this.companyRepository.findAll();
      const systemUser = {
        role: UserRole.ADMIN,
        userRole: UserRole.ADMIN,
      };

      for (const company of companies) {
        if (!company.isActive) {
          continue;
        }

        try {
          const savedCount =
            await this.locationService.refreshAndSaveCompanyLocations(
              company._id.toString(),
              systemUser,
            );
          this.logger.log(
            `Saved ${savedCount} truck locations for company ${company.companyCode}`,
          );
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          this.logger.error(
            `Scheduled location sync failed for company ${company.companyCode}: ${message}`,
          );
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Scheduled location sync failed: ${message}`);
    } finally {
      this.isSyncing = false;
    }
  }
}
