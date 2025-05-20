import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/order/order.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID của sân bóng' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Tên sân bóng' })
  name: string;

  @Column('text')
  @ApiProperty({ description: 'Hình ảnh (Base64)' })
  image: string;

  @Column('text')
  @ApiProperty({ description: 'Mô tả sân bóng' })
  description: string;

  @Column('int')
  @ApiProperty({ description: 'Sức chứa (số lượng tối đa)' })
  capacity: number;

  @Column('decimal')
  @ApiProperty({ description: 'Giá theo giờ' })
  pricePerHour: number;

  @Column()
  @ApiProperty({ description: 'Địa điểm sân bóng' })
  location: string;

  @OneToMany(() => Order, order => order.field)
  orders: Order[];
}