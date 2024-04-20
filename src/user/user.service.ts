import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(userName) {
    const user = new User();
    user.name = userName;
    const newUser = await this.userRepository.save(user);
    return newUser.id;
  }

  async findOneUser(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }
}
