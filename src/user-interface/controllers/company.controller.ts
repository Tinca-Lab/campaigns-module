import { Body, Param } from '@nestjs/common';
import { UpdateEmployeeByIdInteractor } from './../../application-core/company/use-cases/updateEmployeeById.interactor';
import { Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../../application-core/auth/guard/permission.guard';
import { Permission } from '../../application-core/auth/decorators/permissions.decorator';
import { FindEmployeesByCompanyInteractor } from '../../application-core/company/use-cases/findEmployeesByCompany.interactor';
import { UserDocument } from '../../infrastructure/persistence/schemas/user.schema';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly findEmployeesByCompanyInteractor: FindEmployeesByCompanyInteractor,
    private readonly updateEmployeeByIdInteractor: UpdateEmployeeByIdInteractor,
  ) {}

  @Get('employees')
  @UseGuards(PermissionGuard)
  @Permission('write:campaign')
  async findAllEmployees(
    @Query('companyId') companyId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('sort') sort: string,
    @Query('sortBy') sortBy: string,
  ): Promise<UserDocument[]> {
    return await this.findEmployeesByCompanyInteractor.execute(
      { companyId },
      null,
      {
        page,
        pageSize,
        sort,
        sortBy,
      },
    );
  }

  @Put('employee/:id')
  @UseGuards(PermissionGuard)
  @Permission('write:campaign')
  async update(
    @Param('id') id: string,
    @Body() payload: any,
  ): Promise<UserDocument> {
    return await this.updateEmployeeByIdInteractor.execute(id, payload);
  }
}
