import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EscrowService } from './escrow.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Escrow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('escrow')
export class EscrowController {
  constructor(private escrowService: EscrowService) {}

  @Get()
  @Roles('ADMIN', 'SUPER_ADMIN')
  findAll(@Query() query: any) {
    return this.escrowService.findAll(query);
  }

  @Get('fees')
  @Roles('ADMIN', 'SUPER_ADMIN')
  getFees() {
    return this.escrowService.getPlatformFees();
  }

  @Post(':id/release')
  @Roles('ADMIN', 'SUPER_ADMIN')
  release(@Param('id') id: string, @CurrentUser() user: any, @Body() body: { notes?: string }) {
    return this.escrowService.releaseFunds(id, user.id, body.notes);
  }

  @Post(':id/refund')
  @Roles('ADMIN', 'SUPER_ADMIN')
  refund(@Param('id') id: string, @CurrentUser() user: any, @Body() body: { reason: string }) {
    return this.escrowService.refundFunds(id, user.id, body.reason);
  }
}
