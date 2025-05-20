import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import { Field } from 'src/field/field.entity';
import { Transaction } from 'src/wallet/entity/transaction.entity';

export enum OrderStatus {
  Pending  = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID của đơn đặt sân' })
  id: number;

  @Column({ type: 'date' })
  @ApiProperty({ description: 'Ngày đặt sân (YYYY-MM-DD)' })
  date: string;

  @Column({ type: 'time' })
  @ApiProperty({ description: 'Giờ bắt đầu (HH:MM:SS)' })
  startTime: string;

  @Column({ type: 'time' })
  @ApiProperty({ description: 'Giờ kết thúc (HH:MM:SS)' })
  endTime: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  @ApiProperty({ 
    description: 'Trạng thái đơn',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @ManyToOne(() => User, user => user.orders, { eager: true })
  @ApiProperty({ description: 'Người đặt sân' })
  user: User;

  @ManyToOne(() => Field, field => field.orders, { eager: true })
  @ApiProperty({ description: 'Sân được đặt' })
  field: Field;

}