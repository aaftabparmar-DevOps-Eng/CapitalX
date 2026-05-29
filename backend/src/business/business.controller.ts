import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Businesses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('businesses')
export class BusinessController {
  constructor(private businessService: BusinessService) {}

  @Post()
  @Roles('BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN')
  create(@CurrentUser() user: any, @Body() dto: any) {
    return this.businessService.create(user.id, dto);
  }

  @Public()
  @Get()
  findAll(@Query() query: any) {
    return this.businessService.findVerified(query);
  }

  @Get('admin/all')
  @Roles('ADMIN', 'SUPER_ADMIN')
  findAllAdmin(@Query() query: any) {
    return this.businessService.findAll(query);
  }

  @Get('my')
  @Roles('BUSINESS_OWNER')
  findMine(@CurrentUser() user: any) {
    return this.businessService.findByOwner(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: any) {
    return this.businessService.update(id, user.id, dto, user.role);
  }

  @Post(':id/submit')
  @Roles('BUSINESS_OWNER')
  submitForReview(@Param('id') id: string, @CurrentUser() user: any) {
    return this.businessService.submitForReview(id, user.id);
  }

  @Post(':id/approve')
  @Roles('ADMIN', 'SUPER_ADMIN')
  approve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.businessService.approve(id, user.id);
  }

  @Post(':id/reject')
  @Roles('ADMIN', 'SUPER_ADMIN')
  reject(@Param('id') id: string, @CurrentUser() user: any, @Body() body: { reason: string }) {
    return this.businessService.reject(id, user.id, body.reason);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.businessService.delete(id, user.id, user.role);
  }
}
