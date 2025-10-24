import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BanksService {
  constructor(private readonly http: HttpService) {}

  async getBanks() {
    const url = 'https://api.paystack.co/bank';
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: any[] }>(url, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }),
      );
      return response.data.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Error fetching banks',
        err.response?.status || 400,
      );
    }
  }
}
