/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from 'src/wallet/entity/wallet.entity';
import { Transaction } from 'src/wallet/entity/transaction.entity';
import { Order } from 'src/order/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID của người dùng' })
  id: number;

  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Username của người dùng' })
  username: string;

  @Column()
  @IsNotEmpty()
  @ApiProperty({ description: 'Mật khẩu của người dùng' })
  password: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @ApiProperty({ description: 'Email của người dùng' })
  email: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Ảnh đại diện Base64', required: false })
  avatar?: string;

  @Column({ default: 'user' })
  @ApiProperty({ description: 'Vai trò của người dùng', enum: ['user', 'admin', 'owner'] })
  role: string;

  @Column({ default: false })
  @ApiProperty({ description: 'Trạng thái hoạt động của người dùng' })
  isActive: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Token kích hoạt' })
  activationToken: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  @JoinColumn()
  @ApiProperty({ description: 'Ví của người dùng' })
  wallet: Wallet;
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Order, (order) => order.user)      
  @ApiProperty({ description: 'Các đơn đặt của người dùng' })
  orders: Order[];
}