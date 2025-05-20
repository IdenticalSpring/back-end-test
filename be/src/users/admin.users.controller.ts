import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {  ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('admin/users')
@ApiTags('admin/users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng (Admin only)' })
  @ApiResponse({ status: 200, description: 'Danh sách người dùng' })
  async getAllUsers() {
    return this.usersService.findAll();
  }
  @Patch('/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng (Admin only)' })
  @ApiResponse({ status: 200, description: 'Người dùng được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Vô hiệu hóa người dùng (Admin only)' })
  @ApiResponse({ status: 200, description: 'Người dùng đã bị vô hiệu hóa' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async disableUser(@Param('id') id: string) {
    return this.usersService.disable(+id);
  }
}