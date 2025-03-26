import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { RefreshToken } from '../entities/refresh-token.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private userService: UserService,
  ) {}

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
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      { secret: process.env.REFRESH_TOKEN_SECRET_KEY, expiresIn: '1w' },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.createRefreshToken(user.id, refreshToken, expiresAt);

    return refreshToken;
  }

  async getNewAccessToken(refreshToken: string): Promise<string> {
    let decodedToken;
    try {
      decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const user = await this.userService.findOneUser(decodedToken.id);

    const userRefreshToken = await this.findOneRefreshToken(
      decodedToken.id,
      refreshToken,
    );
    if (!userRefreshToken || userRefreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token is expired.');
    }

    const newAccessToken = await this.getAccessToken(user);
    return newAccessToken;
  }

  async findOneRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<RefreshToken> {
    const userRefreshToken = await this.refreshTokenRepository.findOne({
      where: { user: { id: userId }, refreshToken },
    });
    return userRefreshToken;
  }

  async createRefreshToken(
    userId: number,
    refreshToken: string,
    expiresAt: Date,
  ) {
    const user = await this.userService.findOneUser(userId);

    const token = await this.refreshTokenRepository.create({
      user,
      refreshToken,
      expiresAt,
    });

    return this.refreshTokenRepository.save(token);
  }

  async deleteRefreshToken(userId: number) {
    return this.refreshTokenRepository.delete({ user: { id: userId } });
  }
}
