import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Username của người dùng' })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Mật khẩu của người dùng' })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email của người dùng' })
  email: string;

  @ApiProperty({ description: 'Ảnh đại diện Base64', required: false })
  avatar?: string;
}