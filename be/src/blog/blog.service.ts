import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Blog } from './blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly repo: Repository<Blog>,
  ) {}

  create(data: Partial<Blog>): Promise<Blog> {
    const blog = this.repo.create(data);
    return this.repo.save(blog);
  }

  findAll(): Promise<Blog[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Blog | null> {
    return this.repo.findOne({ where: { id } });
  }

  update(id: number, data: Partial<Blog>): Promise<UpdateResult> {
    return this.repo.update(id, data);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}