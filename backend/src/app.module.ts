import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SafeLockModule } from './safelock/safelock.module';
import { GroupsModule } from './groupsaving/groupsaving.module';
import { RewardsModule } from './rewards/rewards.module';
import { TargetSavingsModule } from './target-savings/target-savings.module';
import { FlexWalletModule } from './flex-wallet/flex-wallet.module';
import { FixedDepositModule } from './fixed-deposit/fixed-deposit.module';
import { ContributionModule } from './contribution/contribution.module';
import { UserActivityModule } from './user-activity/user-activity.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BanksModule } from './banks/banks.module';
import { SavingsModule } from './savings/savings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'Morayoluwa@2020',
      database: process.env.POSTGRES_DB || 'PocketMoni',
      autoLoadEntities: true,
      synchronize: true, // turn off in production
    }),
    AuthModule,
    UsersModule,
    SafeLockModule,
    TargetSavingsModule,
    GroupsModule,
    RewardsModule,
    FlexWalletModule,
    FixedDepositModule,
    ContributionModule,
    UserActivityModule,
    TransactionsModule,
    BanksModule,
    SavingsModule,
  ],
})
export class AppModule {}
