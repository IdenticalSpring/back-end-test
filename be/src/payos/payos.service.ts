import { Injectable } from '@nestjs/common';
import PayOS from '@payos/node';

@Injectable()
export class PayOSService {
    private payOSClient;

    constructor() {
        this.payOSClient = new PayOS(
            process.env.PAYOS_CLIENT_ID || '',
            process.env.PAYOS_API_KEY || '',
            process.env.PAYOS_CHECKSUM_KEY || ''
        );
    }

    async createPaymentLink(orderData: {
        orderCode: number;
        amount: number;
        description: string;
        returnUrl: string;
        cancelUrl: string;
        items: { name: string; quantity: number; price: number }[];
    }): Promise<string> {
        try {
            const paymentLinkResponse = await this.payOSClient.createPaymentLink(orderData);
            return paymentLinkResponse.checkoutUrl; 
        } catch (error) {
            console.error('Lỗi khi tạo liên kết thanh toán:', error.response?.data || error.message);
            throw new Error('Không thể tạo liên kết thanh toán');
        }
    }

    async getPaymentLinkInfo(orderCode: number | string): Promise<any> {
        try {
            return await this.payOSClient.getPaymentLinkInformation(orderCode);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin liên kết thanh toán:', error.response?.data || error.message);
            throw new Error('Không thể lấy thông tin liên kết thanh toán');
        }
    }

    async cancelPaymentLink(orderCode: string | number, reason: string): Promise<any> {
        try {
            return await this.payOSClient.cancelPaymentLink(orderCode, reason);
        } catch (error) {
            console.error('Lỗi khi hủy liên kết thanh toán:', error.response?.data || error.message);
            throw new Error('Không thể hủy liên kết thanh toán');
        }
    }

    verifyPaymentWebhookData(webhookData: any): any {
        try {
            const verifiedData = this.payOSClient.verifyPaymentWebhookData(webhookData);
            return verifiedData;
        } catch (error) {
            throw new Error('Không thể xác minh dữ liệu webhook');
        }
    }
}