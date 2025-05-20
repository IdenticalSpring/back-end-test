import { Controller, Post, Get, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { FieldService } from './field.service';
import { Field } from './field.entity';

@ApiTags('fields')
@Controller('fields')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class FieldController {
  constructor(private readonly service: FieldService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Tạo sân bóng mới (Admin only)' })
  create(@Body() data: Partial<Field>) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả sân bóng' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin sân bóng theo ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Cập nhật sân bóng (Admin only)' })
  update(@Param('id') id: string, @Body() data: Partial<Field>) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Xóa sân bóng (Admin only)' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}