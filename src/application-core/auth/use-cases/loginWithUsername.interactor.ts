import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateways/user.gateway';
import { LoginWithUsernameDto } from '../dto/loginWithUsername.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../../../infrastructure/persistence/schemas/user.schema';
import { JwtDto } from '../dto/jwt.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginWithUsernameInteractor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userGateway: UserGateway,
  ) {}

  async execute(payload: LoginWithUsernameDto): Promise<JwtDto> {
    if (!payload.username) {
      throw new BadRequestException('Username is required');
    }
    if (!payload.password) {
      throw new BadRequestException('Password is required');
    }
    const user: UserDocument = await this.userGateway.findOne({
      username: payload.username,
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
      username: user.username,
      permissions: user.permissions,
      companyId: user.companyId,
    });
    return { access_token };
  }
}
