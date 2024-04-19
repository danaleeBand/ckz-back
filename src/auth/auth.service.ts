import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { Auth, Provider } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private AuthRepository: Repository<Auth>,
    private userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async validateKakaoUser(user: any): Promise<void> {
    const existingUser = await this.findOneAuth(Provider.KAKAO, user.kakaoId);
    if (!existingUser) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const insertUser = await this.userService.createUser(user.userName);
      await this.createAuth(
        Provider.KAKAO,
        insertUser,
        user.kakaoId,
        user.accessToken,
        user.refreshToken,
      );
      await queryRunner.commitTransaction();
    } else {
      await this.updateAuth(
        Provider.KAKAO,
        user.kakaoId,
        user.accessToken,
        user.refreshToken,
      );
    }
  }

  async findOneAuth(provider, providerUserId: string): Promise<Auth> {
    return this.AuthRepository.findOne({
      where: { provider, provider_user_id: providerUserId },
    });
  }

  async createAuth(
    provider: Provider,
    userId: number,
    providerUserId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    const auth = new Auth();
    auth.user_id = userId;
    auth.provider = provider;
    auth.provider_user_id = providerUserId;
    auth.access_token = accessToken;
    auth.refresh_token = refreshToken;
    await this.AuthRepository.save(auth);
  }

  async updateAuth(
    provider: Provider,
    providerUserId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    const auth = await this.findOneAuth(provider, providerUserId);
    auth.access_token = accessToken;
    auth.refresh_token = refreshToken;
    await this.AuthRepository.save(auth);
  }
}
