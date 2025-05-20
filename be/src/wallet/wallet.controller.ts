import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WalletService } from './wallet.service';
import { DepositRequestDto } from 'src/wallet/dto/deposit-request.dto';
import { IsPositive } from 'class-validator';

class UpdateWalletDto {
  @IsPositive()
  balance: number;
}

@ApiTags('wallet')
@Controller('wallet')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('deposit')
  async requestDeposit(
    @Request() req,
    @Body() depositRequestDto: DepositRequestDto,
  ) {
    return this.walletService.requestDeposit(req.user.id, depositRequestDto);
  }

  @Get()
  async getMyWallet(@Request() req) {
    return this.walletService.findByUserId(req.user.id);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.walletService.findById(+id);
  }

  @Put(':id')
  async updateBalance(
    @Param('id') id: string,
    @Body() dto: UpdateWalletDto,
  ) {
    return this.walletService.updateBalance(+id, dto.balance);
  }
}
