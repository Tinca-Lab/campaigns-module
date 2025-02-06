import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateways/user.gateway';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UpdateEmployeeByIdInteractor {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(id: string, payload: any): Promise<any> {
    const user: any = await this.userGateway.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!payload.email) {
      throw new BadRequestException('Email is required');
    }

    if (!payload.password) {
      throw new BadRequestException('Password is required');
    }

    if (!payload.repeatPassword) {
      throw new BadRequestException('Repeat password is required');
    }

    if (payload.password !== payload.repeatPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const salt: string = await bcrypt.genSalt();
    payload.password = await bcrypt.hash(payload.password, salt);

    return this.userGateway.updateById(id, payload);
  }
}
