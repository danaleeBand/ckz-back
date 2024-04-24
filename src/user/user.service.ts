import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import {UpdateUserDto} from "./dtos/update-user.dto";

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
      select: ['name', 'profile_image_url', 'is_checky'],
    });
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    const { name: userName, profile_image_url: profileImageUrl } =
      updateUserDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    user.name = userName;
    user.profile_image_url = profileImageUrl;
    await this.userRepository.save(user);
  }
}
