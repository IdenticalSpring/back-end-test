/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Get, Param, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users') 
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký người dùng mới' })
  @ApiResponse({ status: 201, description: 'Người dùng được tạo thành công' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('test-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Test endpoint bảo mật bằng JWT' })
  async testAuth() {
    return { message: 'You are authenticated!' };
  }
  @Get('activate/:token')
  async activate(@Param('token') token: string) {
    return this.usersService.activate(token);
  }
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Lấy thông tin cá nhân và số dư ví' })
  @ApiResponse({ status: 200, description: 'Trả về tên, email và số dư ví người dùng' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findOneById(req.user.id);
    return {
      username: user.username,
      email: user.email,
      balance: user.wallet.balance
    };
  }
}