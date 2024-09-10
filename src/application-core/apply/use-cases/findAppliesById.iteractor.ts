import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplyGateway } from '../../../infrastructure/persistence/gateways/apply.gateway';
import { ApplyDocument } from '../../../infrastructure/persistence/schemas/apply.schema';

@Injectable()
export class FindAppliesByIdInteractor {
  constructor(private readonly applyGateway: ApplyGateway) {}

  async execute(payload: any): Promise<ApplyDocument> {
    const apply: ApplyDocument = await this.applyGateway.findById(
      payload.applyId,
    );
    if (!apply) {
      throw new NotFoundException('Apply not found');
    }

    return apply;
  }
}
