import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // User signup
  async signup(
    email: string,
    fullName: string,
    password: string,
  ): Promise<User> {
    // Password will be auto-hashed by the entity @BeforeInsert()
    return this.usersService.createUser(email, fullName, password);
  }

  // User login
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Use the entity method to validate the password
    const isValid = await user.validatePassword(password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token, user };
  }
}
