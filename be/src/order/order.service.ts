import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
  ) {}

  create(data: Partial<Order>): Promise<Order> {
    return this.repo.save(this.repo.create(data));
  }

 
  findByUser(userId: number): Promise<Order[]> {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ['field'], // Lấy thông tin field khi tìm đơn hàng của người dùng
    });
  }

  async findOneOwned(id: number, userId: number): Promise<Order> {
    const order = await this.repo.findOne({
      where: { id, user: { id: userId } },
      relations: ['field'], // Đảm bảo có thông tin field khi tìm một đơn đặt của người dùng
    });
    if (!order) {
      throw new NotFoundException('Order not found or not yours');
    }
    return order;
  }

  findAll(): Promise<Order[]> {
    console.log('Fetching all orders...');
    return this.repo.find({
      relations: ['field', 'user'], // Lấy thông tin field và user khi lấy tất cả đơn hàng
    }).catch((err) => {
      console.error('Error fetching orders: ', err);
      throw new Error('Database query failed');
    });
  }
  

  update(id: number, data: Partial<Order>): Promise<UpdateResult> {
    return this.repo.update(id, data);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}
