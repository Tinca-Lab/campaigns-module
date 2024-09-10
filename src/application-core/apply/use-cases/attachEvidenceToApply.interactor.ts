import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplyGateway } from '../../../infrastructure/persistence/gateways/apply.gateway';
import { ApplyDocument } from '../../../infrastructure/persistence/schemas/apply.schema';
import { UserGateway } from '../../../infrastructure/persistence/gateways/user.gateway';
import { CampaignGateway } from '../../../infrastructure/persistence/gateways/campaign.gateway';
import { CompanyGateway } from '../../../infrastructure/persistence/gateways/company.gateway';
import { CompanyDocument } from '../../../infrastructure/persistence/schemas/company.schema';
import { UserDocument } from '../../../infrastructure/persistence/schemas/user.schema';
import { CampaignDocument } from '../../../infrastructure/persistence/schemas/campaign.schema';
import { UploadFileInteractor } from './uploadFile.interactor';

@Injectable()
export class AttachEvidenceToApplyInteractor {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly companyGateway: CompanyGateway,
    private readonly campaignGateway: CampaignGateway,
    private readonly applyGateway: ApplyGateway,
    private readonly uploadFileInteractor: UploadFileInteractor,
  ) {}

  async execute(id: string, payload: any): Promise<any> {
    const user: UserDocument = await this.userGateway.findById(payload.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
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
    const apply: ApplyDocument = await this.applyGateway.findById(id);
    if (!apply) {
      throw new NotFoundException('Apply not found');
    }

    const url: string = await this.uploadFileInteractor.execute('evidences', {
      data: payload.evidence.data,
      ext: payload.evidence.ext,
      mime: payload.evidence.mime,
    });

    const document: any = {
      url,
      mime: payload.evidence.mime,
      ext: payload.evidence.ext,
    };
    apply.evidences = {
      document: {
        url: document.url,
        mime: document.mime,
        ext: document.ext,
      },
      description: payload.evidence.description,
      givenAt: payload.evidence.givenAt,
    };

    return await this.applyGateway.updateById(id, apply);
  }
}
