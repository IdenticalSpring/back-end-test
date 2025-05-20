import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepositRequestDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Số tiền cần nạp' })
  amount: number;
}