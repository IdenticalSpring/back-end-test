import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID của bài viết' })
  id: number;

  @Column({ length: 200 })
  @ApiProperty({ description: 'Tiêu đề bài viết' })
  title: string;
  @Column('text')
  @ApiProperty({ description: 'Hình ảnh (Base64)' })
  image: string;

  @Column('text')
  @ApiProperty({ description: 'Nội dung bài viết' })
  content: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Thời gian tạo' })
  createdAt: Date;
}