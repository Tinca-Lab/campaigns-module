import { Injectable, NotFoundException } from '@nestjs/common';
import { CampaignGateway } from '../../../infrastructure/persistence/gateways/campaign.gateway';
import { CompanyGateway } from '../../../infrastructure/persistence/gateways/company.gateway';
import { UserGateway } from '../../../infrastructure/persistence/gateways/user.gateway';
import { CompanyDocument } from '../../../infrastructure/persistence/schemas/company.schema';
import { UserDocument } from '../../../infrastructure/persistence/schemas/user.schema';
import { CampaignDocument } from '../../../infrastructure/persistence/schemas/campaign.schema';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { UploadFileInteractor } from './../../apply/use-cases/uploadFile.interactor';

@Injectable()
export class CreateCampaignInteractor {
  constructor(
    private readonly campaignGateway: CampaignGateway,
    private readonly companyGateway: CompanyGateway,
    private readonly userGateway: UserGateway,
    private readonly uploadFileInteractor: UploadFileInteractor,
    private eventEmitter: EventEmitter,
  ) {}

  async execute(payload: any): Promise<CampaignDocument> {
    const company: CompanyDocument = await this.companyGateway.findById(
      payload.companyId,
    );
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    const user: UserDocument = await this.userGateway.findById(payload.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    payload.createdBy = payload.userId;
    let url: string;
    if (payload.document) {
      url = await this.uploadFileInteractor.execute('evidences', {
        data: payload.document.data,
        ext: payload.document.ext,
        mime: payload.document.mime,
      });
    }
    const campaign: CampaignDocument = await this.campaignGateway.create({
      ...payload,
      document: { url },
    });
    this.eventEmitter.emit('campaign.created', campaign);
    return campaign;
  }
}
