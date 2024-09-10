import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Apply, ApplyDocument } from '../schemas/apply.schema';

@Injectable()
export class ApplyGateway {
  constructor(
    @InjectModel(Apply.name) private readonly applyModel: Model<ApplyDocument>,
  ) {}

  async create(payload: Apply): Promise<ApplyDocument> {
    return this.applyModel.create(payload);
  }

  async findAll(
    payload?: any,
    projection?: any,
    options?: any,
  ): Promise<ApplyDocument[]> {
    if (!options) {
      return this.applyModel.find(payload, projection).exec();
    }
    const { page, pageSize, sort, sortBy } = options;
    return this.applyModel
      .find(payload, projection)
      .sort({ [sortBy]: sort })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
  }

  async findOne(
    payload: Partial<Apply>,
    projection?: any,
  ): Promise<ApplyDocument> {
    return this.applyModel.findOne(payload, projection).exec();
  }

  async findById(id: string, projection?: any): Promise<ApplyDocument> {
    return this.applyModel.findById(id, projection).exec();
  }

  async update(id: string, apply: Partial<Apply>): Promise<ApplyDocument> {
    return this.applyModel.findByIdAndUpdate(id, apply, { new: true }).exec();
  }

  async updateById(id: string, apply: Partial<Apply>): Promise<ApplyDocument> {
    return this.applyModel.findByIdAndUpdate(id, apply, { new: true }).exec();
  }

  async removeById(id: string): Promise<ApplyDocument> {
    return this.applyModel.findByIdAndDelete(id).exec();
  }

  async remove(apply: Partial<Apply>): Promise<ApplyDocument> {
    return this.applyModel.findOneAndDelete(apply).exec();
  }

  async removeMany(apply: Partial<Apply>): Promise<any> {
    return this.applyModel.deleteMany(apply).exec();
  }

  async count(payload: any): Promise<number> {
    return this.applyModel.countDocuments(payload).exec();
  }
}
