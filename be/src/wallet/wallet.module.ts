import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { AdminWalletController } from './admin.wallet.controller';
import { Wallet } from './entity/wallet.entity';
import { Transaction } from 'src/wallet/entity/transaction.entity';
import { UsersModule } from '../users/users.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PayOSService } from 'src/payos/payos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transaction]),
    UsersModule, 
    HttpModule,
    ConfigModule,
  ],
  providers: [WalletService,PayOSService],
  controllers: [WalletController, AdminWalletController],
  exports: [WalletService],
})
export class WalletModule {}