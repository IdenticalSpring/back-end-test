import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './field.entity';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Field])],
  providers: [FieldService],
  controllers: [FieldController],
})
export class FieldModule {}
