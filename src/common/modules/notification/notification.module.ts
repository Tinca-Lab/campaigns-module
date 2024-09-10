import { Module } from '@nestjs/common';
import { NotificationGateway } from './gateways/notification.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApplicationCoreModule } from '../../../application-core/application-core.module';

@Module({
  imports: [
    ApplicationCoreModule,
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
  providers: [NotificationGateway],
})
export class NotificationModule {}
