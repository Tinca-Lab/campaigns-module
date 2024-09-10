import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateways/user.gateway';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../../../infrastructure/persistence/schemas/user.schema';
import { JwtDto } from '../dto/jwt.dto';
import { JwtService } from '@nestjs/jwt';
import { CompanyGateway } from '../../../infrastructure/persistence/gateways/company.gateway';

@Injectable()
export class LoginInteractor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userGateway: UserGateway,
    private readonly companyGateway: CompanyGateway,
  ) {}

  async execute(payload: LoginDto): Promise<JwtDto> {
    if (!payload.companyId) {
      throw new BadRequestException('Company is required');
    }
    if (!payload.email) {
      throw new BadRequestException('Email is required');
    }
    if (!payload.password) {
      throw new BadRequestException('Password is required');
    }
    const company = await this.companyGateway.findById(payload.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    const user: UserDocument = await this.userGateway.findOne({
      email: payload.email,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid: boolean = await bcrypt.compare(
      payload.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      permissions: user.permissions,
      companyId: user.companyId,
    });
    return { access_token };
  }
}
