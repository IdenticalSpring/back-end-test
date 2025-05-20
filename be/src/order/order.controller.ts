import {
  Controller, Post, Get, Body, Param, Put, Delete, UseGuards, Request
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Order } from './order.entity';

@ApiTags('orders')
@Controller('orders')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn đặt sân mới' })
  create(@Body() data: Partial<Order>, @Request() req) {
    return this.service.create({ ...data, user: req.user });
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách đơn đặt của bạn' })
  findAll(@Request() req) {
    return this.service.findByUser(req.user.id);
  }
  @Get('all')
@ApiOperation({ summary: 'Lấy tất cả đơn đặt sân (admin/public)' })
findAllOrders() {
  try {
    return this.service.findAll();
  } catch (error) {
    console.error('Error in fetching all orders:', error);
    throw new Error('Failed to fetch all orders');
  }
}


 
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết đơn đặt theo ID (của bạn)' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOneOwned(+id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật đơn đặt sân (thay đổi ngày/giờ/trạng thái)' })
  update(@Param('id') id: string, @Body() data: Partial<Order>) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hủy đơn đặt sân' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}