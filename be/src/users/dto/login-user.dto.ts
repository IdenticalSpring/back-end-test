import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'username của người dùng' })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Mật khẩu của người dùng' })
  password: string;
}