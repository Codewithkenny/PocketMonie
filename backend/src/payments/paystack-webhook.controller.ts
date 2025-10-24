import {
  Controller,
  Post,
  Headers,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { TargetSavingsService } from '../target-savings/target-savings.service';
import { UsersService } from '../users/users.service';

@Controller('payments/webhook')
export class PaystackWebhookController {
  private readonly logger = new Logger(PaystackWebhookController.name);

  constructor(
    private readonly targetSavingsService: TargetSavingsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('x-paystack-signature') signature: string,
    @Body() payload: any,
  ) {
    // Verify webhook signature to confirm authenticity
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (hash !== signature) {
      this.logger.warn('Invalid Paystack webhook signature');
      return { status: 'invalid', message: 'Invalid signature' };
    }

    this.logger.log(`Received Paystack webhook event: ${payload.event}`);

    // Handle successful charge event
    if (payload.event === 'charge.success') {
      const data = payload.data;
      const reference = data.reference;
      const amount = data.amount / 100;
      const email = data.customer.email;
      const metadata = data.metadata || {};
      const targetId = metadata.targetId ? String(metadata.targetId) : null;

      if (!targetId) {
        this.logger.warn('Missing targetId in Paystack metadata');
        return { status: 'error', message: 'Missing targetId' };
      }

      // Retrieve user by email or implement better user identification
      const user = await this.usersService.findByEmail(email);
      if (!targetId) {
        this.logger.warn('Missing targetId in Paystack metadata');
        return { status: 'error', message: 'Missing targetId' };
      }

      // Process deposit update and transaction creation
      try {
        await this.targetSavingsService.deposit(user, targetId, amount);
        this.logger.log(
          `Processed deposit of ₦${amount} for targetId ${targetId} user ${email}`,
        );
      } catch (error) {
        this.logger.error(`Deposit processing failed: ${error.message}`);
        return { status: 'error', message: error.message };
      }
    }

    return { status: 'success' };
  }
}
