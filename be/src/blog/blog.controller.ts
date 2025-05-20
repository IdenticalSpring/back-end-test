import { Controller, Post, Get, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { Blog } from './blog.entity';

@ApiTags('blogs')
@Controller('blogs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Tạo bài viết mới (Admin only)' })
  create(@Body() data: Partial<Blog>) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả bài viết' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy bài viết theo ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Cập nhật bài viết (Admin only)' })
  update(@Param('id') id: string, @Body() data: Partial<Blog>) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Xóa bài viết (Admin only)' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}