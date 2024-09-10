import { Injectable, NotFoundException } from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateways/user.gateway';
import { CompanyGateway } from '../../../infrastructure/persistence/gateways/company.gateway';
import { CampaignGateway } from '../../../infrastructure/persistence/gateways/campaign.gateway';
import { CompanyDocument } from '../../../infrastructure/persistence/schemas/company.schema';
import { UserDocument } from '../../../infrastructure/persistence/schemas/user.schema';
import { CampaignDocument } from '../../../infrastructure/persistence/schemas/campaign.schema';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { ApplyGateway } from '../../../infrastructure/persistence/gateways/apply.gateway';
import { ApplyDocument } from '../../../infrastructure/persistence/schemas/apply.schema';
import { CreateApplyDTO } from '../dto/apply.dto';
import { UploadFileInteractor } from './uploadFile.interactor';

@Injectable()
export class ApplyToCampaignInteractor {
  constructor(
    private readonly campaignGateway: CampaignGateway,
    private readonly companyGateway: CompanyGateway,
    private readonly userGateway: UserGateway,
    private readonly eventEmitter: EventEmitter,
    private readonly applyGateway: ApplyGateway,
    private readonly uploadFileInteractor: UploadFileInteractor,
  ) {}

  async execute(payload: CreateApplyDTO): Promise<ApplyDocument> {
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
    const campaign: CampaignDocument = await this.campaignGateway.findById(
      payload.campaignId,
    );
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    let apply: ApplyDocument;
    apply = await this.applyGateway.findOne({
      campaignId: payload.campaignId,
      userId: payload.userId,
      companyId: payload.companyId,
    });

    let url: string;
    if (payload.evidences) {
      url = await this.uploadFileInteractor.execute('evidences', {
        data: payload.evidences.document.data,
        ext: payload.evidences.document.ext,
        mime: payload.evidences.document.mime,
      });
    }

    apply = await this.applyGateway.create({
      evidences: {
        document: {
          url: url,
          mime: payload.evidences.document.mime,
          ext: payload.evidences.document.ext,
        },
        description: payload.evidences.description,
        givenAt: payload.evidences.givenAt,
      },
      userId: payload.userId,
      campaignId: payload.campaignId,
      companyId: payload.companyId,
      client: payload.client,
      location: {
        latitude: payload.location.latitude,
        longitude: payload.location.longitude,
      },
    });

    this.eventEmitter.emit('apply.created', apply);
    return apply;
  }
}
