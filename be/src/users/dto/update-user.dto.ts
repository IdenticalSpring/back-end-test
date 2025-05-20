import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Username của người dùng', required: false })
  username?: string;

  @IsOptional()
  @ApiProperty({ description: 'Mật khẩu của người dùng', required: false })
  password?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ description: 'Email của người dùng', required: false })
  email?: string;
  
  @ApiProperty({ description: 'Ảnh đại diện Base64', required: false })
  avatar?: string;
}