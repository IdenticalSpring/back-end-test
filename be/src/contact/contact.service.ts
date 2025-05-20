import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Contact } from './contact.entity';


@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly repo: Repository<Contact>,
  ) {}

  create(data: Partial<Contact>): Promise<Contact> {
    const contact = this.repo.create(data);
    return this.repo.save(contact);
  }

  findAll(): Promise<Contact[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Contact> {
    const contact = await this.repo.findOne({ where: { id } });
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  update(id: number, data: Partial<Contact>): Promise<UpdateResult> {
    return this.repo.update(id, data);
  }

  async remove(id: number): Promise<void> {
    const result: DeleteResult = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Contact not found');
    }
  }
}
