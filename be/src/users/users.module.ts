import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { Wallet } from '../wallet/entity/wallet.entity';
import { AdminUsersController } from './admin.users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet]),
    MailerModule,
  ],
  providers: [UsersService],
  controllers: [UsersController,AdminUsersController],
  exports: [UsersService],
})
export class UsersModule {}