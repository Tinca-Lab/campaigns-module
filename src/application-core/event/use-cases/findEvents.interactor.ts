import { Injectable } from '@nestjs/common';
import { EventGateway } from '../../../infrastructure/persistence/gateways/event.gateway';
import { EventDocument } from '../../../infrastructure/persistence/schemas/event.schema';

@Injectable()
export class FindEventsInteractor {
  constructor(private readonly eventGateway: EventGateway) {}

  async execute(payload: any, projection?: any, options?: any) {
    const events: EventDocument[] = await this.eventGateway.findAll(
      payload,
      projection,
      options,
    );
    if (!events[0]) {
      return [];
    }
    return events;
  }
}
