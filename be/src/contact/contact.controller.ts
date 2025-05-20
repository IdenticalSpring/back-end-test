import { Controller, Post, Get, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { Contact } from './contact.entity';

@ApiTags('contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly service: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Gửi thông tin liên hệ' })
  create(@Body() data: Partial<Contact>): Promise<Contact> {
    return this.service.create(data);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Danh sách tất cả liên hệ (Admin only)' })
  findAll(): Promise<Contact[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem chi tiết liên hệ theo ID (Admin only)' })
  findOne(@Param('id') id: string): Promise<Contact> {
    return this.service.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật liên hệ (Admin only)' })
  update(@Param('id') id: string, @Body() data: Partial<Contact>) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa liên hệ (Admin only)' })
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}
