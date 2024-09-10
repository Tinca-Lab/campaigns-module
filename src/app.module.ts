import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserInterfaceModule } from './user-interface/user-interface.module';
import DatabaseConfig from './common/config/database.config';
import SecurityConfig from './common/config/security.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './application-core/auth/guard/jwt.guard';
import { JwtStrategy } from './application-core/auth/strategy/jwt.strategy';
import { NotificationModule } from './common/modules/notification/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}` || '.env',
      load: [SecurityConfig, DatabaseConfig],
    }),
    EventEmitterModule.forRoot(),
    NotificationModule,
    UserInterfaceModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
