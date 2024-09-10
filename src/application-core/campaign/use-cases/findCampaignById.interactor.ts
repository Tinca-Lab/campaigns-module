import { Injectable, NotFoundException } from '@nestjs/common';
import { CampaignGateway } from '../../../infrastructure/persistence/gateways/campaign.gateway';
import { CompanyGateway } from '../../../infrastructure/persistence/gateways/company.gateway';
import { CompanyDocument } from '../../../infrastructure/persistence/schemas/company.schema';
import { CampaignDocument } from '../../../infrastructure/persistence/schemas/campaign.schema';

@Injectable()
export class FindCampaignByIdInteractor {
  constructor(
    private readonly campaignGateway: CampaignGateway,
    private readonly companyGateway: CompanyGateway,
  ) {}

  async execute(payload: any): Promise<any> {
    const company: CompanyDocument = await this.companyGateway.findById(
      payload.companyId,
    );
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    const campaign: CampaignDocument = await this.campaignGateway.findById(
      payload.campaignId,
    );
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }
    return campaign;
  }
}
