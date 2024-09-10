import { Module } from '@nestjs/common';
import { ApplicationCoreModule } from '../application-core/application-core.module';
import { AuthController } from './controllers/auth.controller';
import { ApplyController } from './controllers/apply.controller';
import { CompanyController } from './controllers/company.controller';
import { CampaignController } from './controllers/campaign.controller';

@Module({
  imports: [ApplicationCoreModule],
  controllers: [
    AuthController,
    ApplyController,
    CompanyController,
    CampaignController,
  ],
})
export class UserInterfaceModule {}
