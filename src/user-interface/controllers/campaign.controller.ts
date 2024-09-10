import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCampaignInteractor } from '../../application-core/campaign/use-cases/createCampaign.interactor';
import { Permission } from '../../application-core/auth/decorators/permissions.decorator';
import { CampaignDocument } from '../../infrastructure/persistence/schemas/campaign.schema';
import { PermissionGuard } from '../../application-core/auth/guard/permission.guard';
import { FindCampaignsInteractor } from '../../application-core/campaign/use-cases/findCampaigns.interactor';
import { DeleteCampaignInteractor } from '../../application-core/campaign/use-cases/deleteCampaign.interactor';
import { FindCampaignByIdInteractor } from '../../application-core/campaign/use-cases/findCampaignById.interactor';
import { UpdateCampaignByIdInteractor } from '../../application-core/campaign/use-cases/updateCampaignById.interactor';
import { CountCampaignsInteractor } from '../../application-core/campaign/use-cases/countCampaigns.interactor';

ApiTags('Campaigns');

@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly createCampaignInteractor: CreateCampaignInteractor,
    private readonly findCampaignsInteractor: FindCampaignsInteractor,
    private readonly deleteCampaignInteractor: DeleteCampaignInteractor,
    private readonly findCampaignByIdInteractor: FindCampaignByIdInteractor,
    private readonly updateCampaignByIdInteractor: UpdateCampaignByIdInteractor,
    private readonly countCampaignsInteractor: CountCampaignsInteractor,
  ) {}

  @Post()
  @UseGuards(PermissionGuard)
  @Permission('write:campaign')
  async create(@Body() payload: any): Promise<CampaignDocument> {
    return await this.createCampaignInteractor.execute(payload);
  }

  @Get()
  @UseGuards(PermissionGuard)
  @Permission('read:campaign')
  async findAll(
    @Query('companyId') companyId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('sort') sort: string,
    @Query('sortBy') sortBy: string,
  ): Promise<CampaignDocument[]> {
    return await this.findCampaignsInteractor.execute(
      {
        companyId,
      },
      null,
      {
        page,
        pageSize,
        sort,
        sortBy,
      },
    );
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @Permission('delete:campaign')
  async delete(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
  ): Promise<any> {
    return await this.deleteCampaignInteractor.execute({
      companyId,
      campaignId: id,
    });
  }

  @Get('/count')
  @UseGuards(PermissionGuard)
  @Permission('read:campaign')
  async count(@Query('companyId') companyId: string): Promise<number> {
    return await this.countCampaignsInteractor.execute({ companyId });
  }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @Permission('read:campaign')
  async findById(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
  ): Promise<CampaignDocument> {
    return await this.findCampaignByIdInteractor.execute({
      campaignId: id,
      companyId,
    });
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @Permission('write:campaign')
  async update(
    @Param('id') id: string,
    @Body() payload: any,
  ): Promise<CampaignDocument> {
    return await this.updateCampaignByIdInteractor.execute(id, payload);
  }
}
