import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserGateway } from './gateways/user.gateway';
import { Company, CompanySchema } from './schemas/company.schema';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { Apply, ApplySchema } from './schemas/apply.schema';
import { CompanyGateway } from './gateways/company.gateway';
import { ApplyGateway } from './gateways/apply.gateway';
import { CampaignGateway } from './gateways/campaign.gateway';
import { EventSchema, Event } from './schemas/event.schema';
import { EventGateway } from './gateways/event.gateway';

const SERVICES = [
  UserGateway,
  CompanyGateway,
  CampaignGateway,
  ApplyGateway,
  EventGateway,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Company.name,
        schema: CompanySchema,
      },
      {
        name: Campaign.name,
        schema: CampaignSchema,
      },
      {
        name: Apply.name,
        schema: ApplySchema,
      },
      {
        name: Event.name,
        schema: EventSchema,
      },
    ]),
  ],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class PersistenceModule {}
