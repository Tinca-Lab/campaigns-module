import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from '../schemas/campaign.schema';

@Injectable()
export class CampaignGateway {
  constructor(
    @InjectModel(Campaign.name)
    private readonly campaignModel: Model<CampaignDocument>,
  ) {}

  async create(payload: Campaign): Promise<CampaignDocument> {
    return this.campaignModel.create(payload);
  }

  async findAll(
    payload?: any,
    projection?: any,
    options?: any,
  ): Promise<CampaignDocument[]> {
    if (!options) {
      return this.campaignModel.find(payload, projection).exec();
    }
    const { page, pageSize, sort, sortBy } = options;
    return this.campaignModel
      .find(payload, projection)
      .sort({ [sortBy]: sort })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
  }

  async findOne(
    payload: Partial<Campaign>,
    projection?: any,
  ): Promise<CampaignDocument> {
    return this.campaignModel.findOne(payload, projection).exec();
  }

  async findById(id: string, projection?: any): Promise<CampaignDocument> {
    return this.campaignModel.findById(id, projection).exec();
  }

  async update(id: string, user: Partial<Campaign>): Promise<CampaignDocument> {
    return this.campaignModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async updateById(
    id: string,
    user: Partial<Campaign>,
  ): Promise<CampaignDocument> {
    return this.campaignModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async removeById(id: string): Promise<CampaignDocument> {
    return this.campaignModel.findByIdAndDelete(id).exec();
  }

  async remove(user: Partial<Campaign>): Promise<CampaignDocument> {
    return this.campaignModel.findOneAndDelete(user).exec();
  }

  async count(payload: any): Promise<number> {
    return this.campaignModel.countDocuments(payload).exec();
  }
}
