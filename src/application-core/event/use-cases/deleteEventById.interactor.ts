import { Injectable } from '@nestjs/common';
import { EventGateway } from '../../../infrastructure/persistence/gateways/event.gateway';

@Injectable()
export class DeleteEventByIdInteractor {
  constructor(private readonly eventGateway: EventGateway) {}

  async execute(id: string): Promise<any> {
    return await this.eventGateway.removeById(id);
  }
}
