import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@ApiTags('회원가입/로그인')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/kakao')
  @ApiOperation({
    summary: '카카오 로그인 페이지',
    description: '카카오 로그인 페이지',
  })
  async kakaoAuth(@Res() res: Response): Promise<void> {
    const callbackURL = encodeURIComponent(process.env.KAKAO_REDIRECT_URI);
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${callbackURL}`;
    res.redirect(url);
  }

  @Get('kakao/token')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: '카카오 인증',
    description: '카카오 인증',
  })
  @ApiQuery({
    name: 'code',
    type: String,
    required: true,
    description: '카카오 인증 코드',
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      example: {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async kakaoAuthCallback(@Req() req) {
    const { accessToken, refreshToken } = await this.authService.getJwtToken(
      req.user,
    );
    return { accessToken, refreshToken };
  }
}
