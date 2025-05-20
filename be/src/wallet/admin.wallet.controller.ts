import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ConfirmDepositDto } from 'src/wallet/dto/confirm-deposit.dto'; 
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/wallet')
@ApiTags('admin/wallet')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminWalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('confirm-deposit')
  async confirmDeposit(@Body() confirmDepositDto: ConfirmDepositDto) {
    return this.walletService.confirmDeposit(confirmDepositDto);
  }

  @Get('pending-transactions')
  async getPendingTransactions() {
    return this.walletService.getPendingTransactions();
  }
}