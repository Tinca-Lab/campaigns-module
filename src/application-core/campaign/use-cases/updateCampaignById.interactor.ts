import { Injectable, NotFoundException } from '@nestjs/common';
import { CampaignGateway } from '../../../infrastructure/persistence/gateways/campaign.gateway';
import { CompanyGateway } from '../../../infrastructure/persistence/gateways/company.gateway';

@Injectable()
export class UpdateCampaignByIdInteractor {
  constructor(
    private readonly campaignGateway: CampaignGateway,
    private readonly companyGateway: CompanyGateway,
  ) {}

  async execute(id: string, payload: any): Promise<any> {
    const company: any = await this.companyGateway.findById(payload.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    const campaign: any = await this.campaignGateway.findById(id);
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }
    return this.campaignGateway.updateById(id, payload);
  }
}
