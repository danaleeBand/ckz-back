import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { Auth } from './entities/auth.entity';
import { UserModule } from '../user/user.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshToken } from './entities/refresh-token.entity';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'kakao' }),
    TypeOrmModule.forFeature([Auth, RefreshToken]),
    JwtModule.register({}),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy, GoogleStrategy, TokenService],
})
export class AuthModule {}
