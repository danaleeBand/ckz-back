import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { Auth, Provider } from '../entities/auth.entity';
import { User } from '../../user/user.entity';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private userService: UserService,
    private readonly tokenService: TokenService,
    private dataSource: DataSource,
  ) {}

  async validateKakaoUser(user: any): Promise<any> {
    const existingAuth = await this.findOneAuth(Provider.KAKAO, user.kakaoId);
    let existingUser = existingAuth?.user;
    if (!existingAuth) {
      await this.dataSource.transaction(async (manager: EntityManager) => {
        const insertUser = await this.userService.createUser(
          user.userName,
          manager,
        );
        await this.createAuth(
          Provider.KAKAO,
          insertUser,
          user.kakaoId,
          user.accessToken,
          user.refreshToken,
          manager,
        );
        existingUser = insertUser;
      });
    } else {
      await this.updateAuth(
        Provider.KAKAO,
        user.kakaoId,
        user.accessToken,
        user.refreshToken,
      );
    }

    const userInfo = await this.userService.findOneUser(existingUser.id);
    return userInfo;
  }

  async validateGoogleUser(user: any): Promise<any> {
    const existingAuth = await this.findOneAuth(Provider.GOOGLE, user.googleId);
    let existingUser = existingAuth?.user;
    if (!existingAuth) {
      await this.dataSource.transaction(async (manager: EntityManager) => {
        const insertUser = await this.userService.createUser(
          user.userName,
          manager,
        );
        await this.createAuth(
          Provider.GOOGLE,
          insertUser,
          user.googleId,
          user.accessToken,
          user.refreshToken,
          manager,
        );
        existingUser = insertUser;
      });
    } else {
      await this.updateAuth(
        Provider.GOOGLE,
        user.googleId,
        user.accessToken,
        user.refreshToken,
      );
    }

    const userInfo = await this.userService.findOneUser(existingUser.id);
    return userInfo;
  }

  async findOneAuth(provider, providerUserId: string): Promise<Auth> {
    return this.authRepository.findOne({
      where: { provider, providerUserId },
      relations: ['user'],
    });
  }

  async createAuth(
    provider: Provider,
    user: User,
    providerUserId: string,
    accessToken: string,
    refreshToken: string,
    manager?: EntityManager,
  ): Promise<Auth> {
    const auth = await this.authRepository.create({
      user,
      provider,
      providerUserId,
      accessToken,
      refreshToken,
    });
    if (manager) {
      return manager.save(auth);
    }
    return this.authRepository.save(auth);
  }

  async updateAuth(
    provider: Provider,
    providerUserId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    const auth = await this.findOneAuth(provider, providerUserId);
    auth.accessToken = accessToken;
    auth.refreshToken = refreshToken;
    await this.authRepository.save(auth);
  }
}
