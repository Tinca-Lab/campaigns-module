import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Permission } from './application-core/auth/decorators/permissions.decorator';
import { PermissionGuard } from './application-core/auth/guard/permission.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
