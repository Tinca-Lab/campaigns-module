import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplyToCampaignInteractor } from '../../application-core/apply/use-cases/applyToCampaign.interactor';
import { AttachEvidenceToApplyInteractor } from '../../application-core/apply/use-cases/attachEvidenceToApply.interactor';
import { PermissionGuard } from '../../application-core/auth/guard/permission.guard';
import {
  AttachEvidenceDTO,
  CreateApplyDTO,
} from '../../application-core/apply/dto/apply.dto';
import { ApplyDocument } from '../../infrastructure/persistence/schemas/apply.schema';
import { Permission } from '../../application-core/auth/decorators/permissions.decorator';
import { FindAppliesByUserIdInteractor } from '../../application-core/apply/use-cases/findAppliesByUserId.interactor';
import { FindAppliesInteractor } from '../../application-core/apply/use-cases/findApplies.iteractor';
import { FindAppliesByIdInteractor } from 'src/application-core/apply/use-cases/findAppliesById.iteractor';
import { Public } from '../../application-core/auth/decorators/public.decorator';

@ApiTags('Applies')
@Controller('apply')
export class ApplyController {
  constructor(
    private readonly attachEvidenceToApplyInteractor: AttachEvidenceToApplyInteractor,
    private readonly applyToCampaignInteractor: ApplyToCampaignInteractor,
    private readonly findAppliesByUserIdInteractor: FindAppliesByUserIdInteractor,
    private readonly findAppliesInteractor: FindAppliesInteractor,
    private readonly findApplyByIdInteractor: FindAppliesByIdInteractor,
  ) {}

  @Get()
  @UseGuards(PermissionGuard)
  @Permission('write:campaign')
  async findAll(
    @Query('companyId') companyId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('sort') sort: string,
    @Query('sortBy') sortBy: string,
  ): Promise<ApplyDocument[]> {
    return await this.findAppliesInteractor.execute(
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

  @Get(':id')
  @UseGuards(PermissionGuard)
  @Permission('read:campaign')
  async findById(@Param('id') id: string): Promise<ApplyDocument> {
    const apply = await this.findApplyByIdInteractor.execute({
      applyId: id,
    });

    return apply;
  }

  @Public()
  @Post()
  // @Permission('write:apply')
  // @UseGuards(PermissionGuard)
  async applyToCampaign(
    @Body() payload: CreateApplyDTO,
  ): Promise<ApplyDocument> {
    return await this.applyToCampaignInteractor.execute(payload);
  }

  @Public()
  @Post(':id')
  // @Permission('write:apply')
  // @UseGuards(PermissionGuard)
  async attachEvidenceToApply(
    @Param('id') id: string,
    @Body() payload: AttachEvidenceDTO,
  ): Promise<ApplyDocument> {
    return await this.attachEvidenceToApplyInteractor.execute(id, payload);
  }

  @Public()
  @Get('/user/:userId')
  // @Permission('read:apply')}
  // @UseGuards(PermissionGuard)
  async findAppliesByUserId(
    @Param('userId') userId: string,
  ): Promise<ApplyDocument[]> {
    return this.findAppliesByUserIdInteractor.execute(userId);
  }
}
