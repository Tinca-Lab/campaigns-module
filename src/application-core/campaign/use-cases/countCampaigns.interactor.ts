import { Injectable, NotFoundException } from '@nestjs/common';
import { CampaignGateway } from '../../../infrastructure/persistence/gateways/campaign.gateway';
import { CompanyGateway } from '../../../infrastructure/persistence/gateways/company.gateway';

@Injectable()
export class CountCampaignsInteractor {
  constructor(
    private readonly campaignGateway: CampaignGateway,
    private readonly companyGateway: CompanyGateway,
  ) {}

  async execute(payload: any): Promise<number> {
    const company: any = await this.companyGateway.findById(payload.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return this.campaignGateway.count(payload);
  }
}
