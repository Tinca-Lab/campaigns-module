import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyGateway } from '../../../infrastructure/persistence/gateways/company.gateway';
import { CompanyDocument } from '../../../infrastructure/persistence/schemas/company.schema';

@Injectable()
export class FindCompanyByIdInteractor {
  constructor(private readonly companyGateway: CompanyGateway) {}

  async execute(id: string, projection?: any): Promise<CompanyDocument> {
    const company: CompanyDocument = await this.companyGateway.findById(
      id,
      projection,
    );
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }
}
