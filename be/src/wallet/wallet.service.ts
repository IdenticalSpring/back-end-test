import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entity/wallet.entity';
import { Transaction } from 'src/wallet/entity/transaction.entity';
import { UsersService } from '../users/users.service';
import { DepositRequestDto } from 'src/wallet/dto/deposit-request.dto';
import { ConfirmDepositDto } from 'src/wallet/dto/confirm-deposit.dto';
import { PayOSService } from 'src/payos/payos.service'; 

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private usersService: UsersService,
    private payOSService: PayOSService,
  ) {}

  async requestDeposit(userId: number, depositRequestDto: DepositRequestDto): Promise<Transaction> {
    try {
      const user = await this.usersService.findOneById(userId);
      if (!user) {
        throw new NotFoundException('Không tìm thấy người dùng');
      }

      const transaction = this.transactionRepository.create({
        amount: depositRequestDto.amount,
        status: 'pending',
        user,
      });

      const savedTransaction = await this.transactionRepository.save(transaction);

      const paymentLink = await this.payOSService.createPaymentLink({
        orderCode: 100+savedTransaction.id,
        amount: savedTransaction.amount,
        description: `Nạp tiền ví số tiền:${savedTransaction.amount}`,
        returnUrl: `${process.env.FRONTEND_URL}/payos/success`,
        cancelUrl: `${process.env.FRONTEND_URL}/payos/cancel`,
        items: [
          {
            name: `Nạp tiền vào ví người dùng ${user.id}`,
            quantity: 1,
            price: Math.round(savedTransaction.amount),
          },
        ],
      });

      savedTransaction.paymentLink = paymentLink;
      return await this.transactionRepository.save(savedTransaction);
    } catch (error) {
      console.log('Lỗi trong requestDeposit:', error);
      throw error; 
    }
  }

  async confirmDeposit(confirmDepositDto: ConfirmDepositDto): Promise<Wallet> {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id: confirmDepositDto.transactionId, status: 'pending' },
        relations: ['user', 'user.wallet'],
      });
      
      if (!transaction) {
        throw new NotFoundException('Không tìm thấy giao dịch hoặc giao dịch đã được xử lý');
      }

      const wallet = transaction.user.wallet;
      if (!wallet) {
        throw new NotFoundException('Không tìm thấy ví của người dùng');
      }

      wallet.balance += transaction.amount;
      transaction.status = 'approved';

      await this.transactionRepository.save(transaction);
      return await this.walletRepository.save(wallet);
    } catch (error) {
      console.log('Lỗi trong confirmDeposit:', error);
      throw error;
    }
  }

  async getPendingTransactions(): Promise<Transaction[]> {
    try {
      return await this.transactionRepository.find({
        where: { status: 'pending' },
        relations: ['user'],
      });
    } catch (error) {
      console.log('Lỗi trong getPendingTransactions:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Wallet> {
    const w = await this.walletRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!w) throw new NotFoundException('Wallet not found');
    return w;
  }

  async findByUserId(userId: number): Promise<Wallet> {
    const w = await this.walletRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!w) throw new NotFoundException('Wallet not found');
    return w;
  }

  async updateBalance(id: number, balance: number): Promise<Wallet> {
    const wallet = await this.findById(id);
    wallet.balance = balance;
    return this.walletRepository.save(wallet);
  }
}