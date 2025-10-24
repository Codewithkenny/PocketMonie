import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register new user
  @Post('signup')
  async signup(
    @Body('email') email: string,
    @Body('fullName') fullName: string,
    @Body('password') password: string,
  ) {
    const user = await this.authService.signup(email, fullName, password);
    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      },
    };
  }

  // Login existing user
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const { token, user } = await this.authService.login(email, password);
    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  // Protected route example
  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getProfile(@Request() req) {
    return {
      message: 'Dashboard fetched successfully',
      user: req.user,
    };
  }
}
