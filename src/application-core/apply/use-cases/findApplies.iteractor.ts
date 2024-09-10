import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplyGateway } from '../../../infrastructure/persistence/gateways/apply.gateway';
import { CompanyGateway } from '../../../infrastructure/persistence/gateways/company.gateway';
import { CampaignGateway } from '../../../infrastructure/persistence/gateways/campaign.gateway';
import { UserGateway } from '../../../infrastructure/persistence/gateways/user.gateway';
import { ApplyDocument } from '../../../infrastructure/persistence/schemas/apply.schema';
import { CompanyDocument } from '../../../infrastructure/persistence/schemas/company.schema';
import { CampaignDocument } from '../../../infrastructure/persistence/schemas/campaign.schema';
import { UserDocument } from '../../../infrastructure/persistence/schemas/user.schema';

@Injectable()
export class FindAppliesInteractor {
  constructor(
    private readonly applyGateway: ApplyGateway,
    private readonly companyGateway: CompanyGateway,
    private readonly campaignGateway: CampaignGateway,
    private readonly userGateway: UserGateway,
  ) {}

  async execute(payload: any, projection?: any, options?: any): Promise<any> {
    const company: CompanyDocument = await this.companyGateway.findById(
      payload.companyId,
    );
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const applies: ApplyDocument[] = await this.applyGateway.findAll(
      payload,
      projection,
      options,
    );
    if (!applies || !applies.length) {
      return [];
    }

    const applyDetails = await Promise.all(
      applies.map(async (apply) => {
        const campaign: CampaignDocument = await this.campaignGateway.findById(
          apply.campaignId,
        );
        const user: UserDocument = await this.userGateway.findById(
          apply.userId,
        );

        return {
          ...apply.toObject(),
          campaignName: campaign ? campaign.name : null,
          campaignFee: campaign ? campaign.fee : null,
          userName: user ? user.username : null,
        };
      }),
    );

    return applyDetails;
  }
}
