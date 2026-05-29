import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RecoveryService } from './recovery.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Recovery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('recovery')
export class RecoveryController {
  constructor(private recoveryService: RecoveryService) {}

  @Get()
  getAll() { return this.recoveryService.getAllCases(); }

  @Get('stats')
  getStats() { return this.recoveryService.getRecoveryStats(); }

  @Post()
  create(@Body() data: any) { return this.recoveryService.createCase(data); }

  @Post(':id/action')
  updateStatus(@Param('id') id: string, @Body() body: { status: string; notes?: string }) {
    return this.recoveryService.updateStatus(id, body.status, body.notes);
  }
}
