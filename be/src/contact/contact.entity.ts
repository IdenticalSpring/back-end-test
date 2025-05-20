import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID của liên hệ' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Tên người liên hệ' })
  name: string;

  @Column()
  @ApiProperty({ description: 'Email của người liên hệ' })
  email: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Số điện thoại (nếu có)', required: false })
  phone?: string;

  @Column('text')
  @ApiProperty({ description: 'Nội dung tin nhắn' })
  message: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Thời gian gửi liên hệ' })
  createdAt: Date;
}