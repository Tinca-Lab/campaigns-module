import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../schemas/company.schema';

@Injectable()
export class CompanyGateway {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async create(payload: Company): Promise<CompanyDocument> {
    return this.companyModel.create(payload);
  }

  async findAll(
    payload?: any,
    projection?: any,
    options?: any,
  ): Promise<CompanyDocument[]> {
    if (!options) {
      return this.companyModel.find(payload, projection).exec();
    }
    const { page, pageSize, sort, sortBy } = options;
    return this.companyModel
      .find(payload, projection)
      .sort({ [sortBy]: sort })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
  }

  async findOne(
    payload: Partial<Company>,
    projection?: any,
  ): Promise<CompanyDocument> {
    return this.companyModel.findOne(payload, projection).exec();
  }

  async findById(id: string, projection?: any): Promise<CompanyDocument> {
    return this.companyModel.findById(id, projection).exec();
  }

  async update(id: string, user: Partial<Company>): Promise<CompanyDocument> {
    return this.companyModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async updateById(
    id: string,
    user: Partial<Company>,
  ): Promise<CompanyDocument> {
    return this.companyModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async removeById(id: string): Promise<CompanyDocument> {
    return this.companyModel.findByIdAndDelete(id).exec();
  }

  async remove(user: Partial<Company>): Promise<CompanyDocument> {
    return this.companyModel.findOneAndDelete(user).exec();
  }
}
