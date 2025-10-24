import { Injectable, HttpException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

@Injectable()
export class PaystackService {
  private readonly secretKey = process.env.PAYSTACK_SECRET_KEY;

  // Initialize a transaction
  async initializeTransaction(
    email: string,
    amount: number,
    targetId: string,
  ): Promise<any> {
    try {
      const response: AxiosResponse<PaystackResponse<any>> = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount: amount * 100,
          metadata: { targetId: targetId.toString() },
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.data;
    } catch (error: any) {
      console.error(
        'Paystack initialization error:',
        error?.response?.data || error,
      );
      throw new HttpException(
        error?.response?.data?.message || 'Paystack initialization failed',
        error?.response?.status || 500,
      );
    }
  }

  // Verify a transaction
  async verifyTransaction(reference: string): Promise<any> {
    try {
      const response: AxiosResponse<PaystackResponse<any>> = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );

      return response.data.data;
    } catch (error: any) {
      console.error(
        'Paystack verification error:',
        error?.response?.data || error,
      );
      throw new HttpException(
        error?.response?.data?.message || 'Paystack verification failed',
        error?.response?.status || 500,
      );
    }
  }
}
