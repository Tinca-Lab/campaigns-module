import { BadRequestException, Injectable } from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateways/user.gateway';
import { RegisterDto, UserType } from '../dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../../../infrastructure/persistence/schemas/user.schema';

@Injectable()
export class RegisterInteractor {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(payload: RegisterDto) {
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

    const user: UserDocument = await this.userGateway.findOne({
      email: payload.email,
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const salt: string = await bcrypt.genSalt();
    payload.password = await bcrypt.hash(payload.password, salt);

    if (!payload.type) {
      payload.type = UserType.EMPLOYEE;
    }

    if (payload.type === UserType.EMPLOYEE) {
      payload.permissions = [
        'read:self',
        'write:self',
        'read:campaign',
        'read:apply',
        'write:apply',
        'delete:apply',
      ];
    }

    if (payload.type === UserType.MANAGER) {
      payload.permissions = [
        'write:campaign',
        'read:campaign',
        'delete:campaign',
        'read:user',
        'write:user',
        'delete:user',
        'read:apply',
      ];
    }

    return this.userGateway.create({
      type: payload.type,
      ...payload,
    });
  }
}
