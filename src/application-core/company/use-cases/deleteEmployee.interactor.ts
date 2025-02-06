import { UserGateway } from './../../../infrastructure/persistence/gateways/user.gateway';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteEmployeeInteractor {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(payload: any): Promise<any> {
    const user: any = await this.userGateway.findById(payload.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userGateway.removeById(payload.id);
  }
}
