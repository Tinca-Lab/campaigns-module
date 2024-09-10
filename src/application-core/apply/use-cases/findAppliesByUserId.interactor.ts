import { Injectable } from '@nestjs/common';
import { ApplyGateway } from '../../../infrastructure/persistence/gateways/apply.gateway';
import { ApplyDocument } from '../../../infrastructure/persistence/schemas/apply.schema';

@Injectable()
export class FindAppliesByUserIdInteractor {
  constructor(private readonly applyGateway: ApplyGateway) {}

  async execute(userId: string): Promise<ApplyDocument[]> {
    const applies: ApplyDocument[] = await this.applyGateway.findAll({
      userId: userId,
    });
    if (!applies[0]) {
      return [];
    }
    return applies;
  }
}
