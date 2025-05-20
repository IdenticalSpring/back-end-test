import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmDepositDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID của giao dịch' })
  transactionId: number;
}