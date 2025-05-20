import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Field } from './field.entity';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private readonly repo: Repository<Field>,
  ) {}

  create(data: Partial<Field>): Promise<Field> {
    const field = this.repo.create(data);
    return this.repo.save(field);
  }

  findAll(): Promise<Field[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Field | null> {
    return this.repo.findOne({ where: { id } });
  }

  update(id: number, data: Partial<Field>): Promise<UpdateResult> {
    return this.repo.update(id, data);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}
