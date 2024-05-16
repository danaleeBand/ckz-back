import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Auth, Provider } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private AuthRepository: Repository<Auth>,
    private userService: UserService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async validateKakaoUser(user: any): Promise<any> {
    const existingUser = await this.findOneAuth(Provider.KAKAO, user.kakaoId);
    let userId = existingUser?.user_id;
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
      userId = insertUser;
    } else {
      await this.updateAuth(
        Provider.KAKAO,
        user.kakaoId,
        user.accessToken,
        user.refreshToken,
      );
    }

    const userInfo = await this.userService.findOneUser(userId);
    return userInfo;
  }

  async validateGoogleUser(user: any): Promise<any> {
    const existingUser = await this.findOneAuth(Provider.GOOGLE, user.googleId);
    let userId = existingUser?.user_id;
    if (!existingUser) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const insertUser = await this.userService.createUser(user.userName);
      await this.createAuth(
        Provider.GOOGLE,
        insertUser,
        user.googleId,
        user.accessToken,
        user.refreshToken,
      );
      await queryRunner.commitTransaction();
      userId = insertUser;
    } else {
      await this.updateAuth(
        Provider.GOOGLE,
        user.googleId,
        user.accessToken,
        user.refreshToken,
      );
    }

    const userInfo = await this.userService.findOneUser(userId);
    return userInfo;
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

  async getJwtToken(
    user: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.getAccessToken(user);
    const refreshToken = await this.getRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async getAccessToken(user: any): Promise<string> {
    return this.jwtService.sign(
      { id: user.id, name: user.name, profileImgUrl: user.profile_image_url },
      { secret: process.env.ACCESS_TOKEN_SECRET_KEY, expiresIn: '1h' },
    );
  }

  async getRefreshToken(user: any): Promise<string> {
    return this.jwtService.sign(
      { id: user.id, name: user.name, profileImgUrl: user.profile_image_url },
      { secret: process.env.ACCESS_TOKEN_SECRET_KEY, expiresIn: '1w' },
    );
  }
}
