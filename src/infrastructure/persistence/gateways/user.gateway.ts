import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserGateway {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(payload: User): Promise<UserDocument> {
    return this.userModel.create(payload);
  }

  async findAll(
    payload?: any,
    projection?: any,
    options?: any,
  ): Promise<UserDocument[]> {
    if (!options) {
      return this.userModel.find(payload, projection).exec();
    }
    const { page, pageSize, sort, sortBy } = options;
    return this.userModel
      .find(payload, projection)
      .sort({ [sortBy]: sort })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
  }

  async findOne(
    payload: Partial<User>,
    projection?: any,
  ): Promise<UserDocument> {
    return this.userModel.findOne(payload, projection).exec();
  }

  async findById(id: string, projection?: any): Promise<UserDocument> {
    return this.userModel.findById(id, projection).exec();
  }

  async update(id: string, user: Partial<User>): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async updateById(id: string, user: Partial<User>): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async removeById(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async remove(user: Partial<User>): Promise<UserDocument> {
    return this.userModel.findOneAndDelete(user).exec();
  }
}
