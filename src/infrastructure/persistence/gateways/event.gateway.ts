import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDocument, Event } from '../schemas/event.schema';
import { Model } from 'mongoose';

@Injectable()
export class EventGateway {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {}

  async create(event: Event): Promise<EventDocument> {
    return await this.eventModel.create(event);
  }

  async findAll(
    payload: any,
    projection?: any,
    options?: any,
  ): Promise<EventDocument[]> {
    if (!options) {
      return await this.eventModel.find(payload, projection).exec();
    }
    const { page, pageSize, sort, sortBy } = options;
    return await this.eventModel
      .find(payload, projection)
      .sort({ [sortBy]: sort })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .exec();
  }

  async removeById(id: string): Promise<any> {
    return await this.eventModel.findByIdAndDelete(id).exec();
  }
}
