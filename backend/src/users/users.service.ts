import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //  Create a new user
  async createUser(
    email: string,
    fullName: string,
    password: string,
  ): Promise<User> {
    const user = this.userRepository.create({ email, fullName, password });
    return this.userRepository.save(user);
  }

  //  Find a user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  //  Find all users (optional)
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  //  Find a user by ID (optional)
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
