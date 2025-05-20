/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { Wallet } from '../wallet/entity/wallet.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private mailerService: MailerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOneBy({ username: createUserDto.username });
    if (existingUser) {
      throw new ConflictException(`Tên đăng nhập ${createUserDto.username} đã được sử dụng`);
    }
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const activationToken = randomBytes(32).toString('hex'); 
    const backend_url = process.env.BACKEND_URL;
    const user = this.usersRepository.create({
      username: createUserDto.username,
      password: hashedPassword,
      email: createUserDto.email, 
      role: 'user',
      isActive: false,
      activationToken,
    });

    const savedUser = await this.usersRepository.save(user);
    const wallet = this.walletRepository.create({ 
      balance: 0, 
      user: savedUser 
    });
    await this.walletRepository.save(wallet);

    await this.mailerService.sendMail({
      to: createUserDto.email,
      subject: 'Kích hoạt tài khoản của bạn',
      html: `<p>Vui lòng nhấp vào liên kết sau để kích hoạt tài khoản: <a href="${backend_url}/users/activate/${activationToken}">Kích hoạt</a></p>`,
    });

    return savedUser;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['wallet'], 
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với tên đăng nhập ${username}`);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['wallet'] });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['wallet'],
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }

    if (updateUserDto.username) {
      const existingUser = await this.usersRepository.findOneBy({ username: updateUserDto.username });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(`Tên đăng nhập ${updateUserDto.username} đã được sử dụng`);
      }
      user.username = updateUserDto.username;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.usersRepository.save(user);
  }

  async disable(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['wallet'],
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }

    user.isActive = false;
    return this.usersRepository.save(user);
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['wallet'],
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }
    return user;
  }

  async activate(activationToken: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { activationToken },
      relations: ['wallet'], 
    });
  
    if (!user) {
      throw new NotFoundException('Mã kích hoạt không hợp lệ');
    }
  
    user.isActive = true;
    user.activationToken = '';
  
    await this.usersRepository.save(user);
  
    return {
      message: 'Tài khoản đã được kích hoạt',
    };
  }
}