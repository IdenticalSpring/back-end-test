import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret_key', 
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOneByUsername(payload.username); 
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Người dùng không hợp lệ hoặc chưa được kích hoạt');
    }
    return { id: user.id, username: user.username, role: user.role };
  }
}