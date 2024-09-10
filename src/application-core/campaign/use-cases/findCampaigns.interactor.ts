import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyGateway } from '../../../infrastructure/persistence/gateways/company.gateway';
import { CampaignGateway } from '../../../infrastructure/persistence/gateways/campaign.gateway';
import { CompanyDocument } from '../../../infrastructure/persistence/schemas/company.schema';
import { CampaignDocument } from '../../../infrastructure/persistence/schemas/campaign.schema';

@Injectable()
export class FindCampaignsInteractor {
  constructor(
    private readonly campaignGateway: CampaignGateway,
    private readonly companyGateway: CompanyGateway,
  ) {}

  async execute(payload: any, projection?: any, options?: any): Promise<any> {
    const company: CompanyDocument = await this.companyGateway.findById(
      payload.companyId,
    );
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    const campaigns: CampaignDocument[] = await this.campaignGateway.findAll(
      payload,
      projection,
      options,
    );
    if (!campaigns || !campaigns[0]) {
      return [];
    }
    return campaigns;
  }
}
