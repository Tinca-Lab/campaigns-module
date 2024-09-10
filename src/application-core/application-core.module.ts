import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { LoginInteractor } from './auth/use-cases/login.interactor';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterInteractor } from './auth/use-cases/register.interactor';
import { FindCompanyByIdInteractor } from './company/use-cases/findCompanyById.interactor';
import { FindEmployeesByCompanyInteractor } from './company/use-cases/findEmployeesByCompany.interactor';
import { CreateCampaignInteractor } from './campaign/use-cases/createCampaign.interactor';
import { FindCampaignsInteractor } from './campaign/use-cases/findCampaigns.interactor';
import { DeleteCampaignInteractor } from './campaign/use-cases/deleteCampaign.interactor';
import { FindCampaignByIdInteractor } from './campaign/use-cases/findCampaignById.interactor';
import { UpdateCampaignByIdInteractor } from './campaign/use-cases/updateCampaignById.interactor';
import { CountCampaignsInteractor } from './campaign/use-cases/countCampaigns.interactor';
import { ApplyToCampaignInteractor } from './apply/use-cases/applyToCampaign.interactor';
import { AttachEvidenceToApplyInteractor } from './apply/use-cases/attachEvidenceToApply.interactor';
import { CreateEventInteractor } from './event/use-cases/createEvent.interactor';
import { FindEventsInteractor } from './event/use-cases/findEvents.interactor';
import { DeleteEventByIdInteractor } from './event/use-cases/deleteEventById.interactor';
import { FindAppliesInteractor } from './apply/use-cases/findApplies.iteractor';
import { FindAppliesByUserIdInteractor } from './apply/use-cases/findAppliesByUserId.interactor';
import { LoginWithUsernameInteractor } from './auth/use-cases/loginWithUsername.interactor';
import { FindAppliesByIdInteractor } from './apply/use-cases/findAppliesById.iteractor';
import { UploadFileInteractor } from './apply/use-cases/uploadFile.interactor';

const SERVICES = [
  LoginInteractor,
  RegisterInteractor,
  LoginWithUsernameInteractor,
  //  Company
  FindCompanyByIdInteractor,
  FindEmployeesByCompanyInteractor,
  //   Campaign
  CreateCampaignInteractor,
  FindCampaignsInteractor,
  DeleteCampaignInteractor,
  FindCampaignByIdInteractor,
  UpdateCampaignByIdInteractor,
  CountCampaignsInteractor,
  // Apply
  ApplyToCampaignInteractor,
  AttachEvidenceToApplyInteractor,
  FindAppliesByUserIdInteractor,
  FindAppliesInteractor,
  FindAppliesByIdInteractor,
  // Event
  CreateEventInteractor,
  FindEventsInteractor,
  DeleteEventByIdInteractor,
  //
  UploadFileInteractor,
];

@Module({
  imports: [
    InfrastructureModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('security.jwt.secret'),
        signOptions: {
          expiresIn: configService.get('security.jwt.expiresIn'),
        },
      }),
    }),
  ],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class ApplicationCoreModule {}
