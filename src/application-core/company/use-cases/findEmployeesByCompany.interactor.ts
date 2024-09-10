import { Injectable } from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateways/user.gateway';
import { UserDocument } from '../../../infrastructure/persistence/schemas/user.schema';
import { CompanyDocument } from '../../../infrastructure/persistence/schemas/company.schema';
import { CompanyGateway } from '../../../infrastructure/persistence/gateways/company.gateway';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class FindEmployeesByCompanyInteractor {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly companyGateway: CompanyGateway,
  ) {}

  async execute(
    payload?: any,
    projection?: any,
    options?: any,
  ): Promise<UserDocument[]> {
    const company: CompanyDocument = await this.companyGateway.findById(
      payload.companyId,
    );
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    payload.type = 'EMPLOYEE';

    const employees: UserDocument[] = await this.userGateway.findAll(
      payload,
      projection,
      options,
    );

    if (!employees || !employees[0]) {
      return [];
    }

    return employees;
  }
}
