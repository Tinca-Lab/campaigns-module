import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplyGateway } from '../../../infrastructure/persistence/gateways/apply.gateway';
import { CompanyGateway } from '../../../infrastructure/persistence/gateways/company.gateway';
import { CampaignGateway } from '../../../infrastructure/persistence/gateways/campaign.gateway';
import { CampaignDocument } from '../../../infrastructure/persistence/schemas/campaign.schema';
import { CompanyDocument } from '../../../infrastructure/persistence/schemas/company.schema';

@Injectable()
export class DeleteCampaignInteractor {
  constructor(
    private readonly campaignGateway: CampaignGateway,
    private readonly companyGateway: CompanyGateway,
    private readonly applyGateway: ApplyGateway,
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
    await this.applyGateway.removeMany({
      campaignId: payload.campaignId,
    });
    return this.campaignGateway.removeById(payload.campaignId);
  }
}
