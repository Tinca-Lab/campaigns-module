import { Injectable } from '@nestjs/common';
import { EventGateway } from '../../../infrastructure/persistence/gateways/event.gateway';
import {
  Event,
  EventDocument,
} from '../../../infrastructure/persistence/schemas/event.schema';

@Injectable()
export class CreateEventInteractor {
  constructor(private readonly eventGateway: EventGateway) {}

  async execute(payload: Event): Promise<EventDocument> {
    return await this.eventGateway.create(payload);
  }
}
