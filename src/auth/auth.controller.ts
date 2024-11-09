import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

@ApiTags('회원가입/로그인')
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

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

  @Get('/kakao/token')
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
  async kakaoAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.tokenService.getJwtToken(
      req.user,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.REFRESH_TOKEN_SECURE === 'true',
      sameSite: process.env.REFRESH_TOKEN_SAMESITE as 'lax' | 'strict' | 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1w
    });

    return { accessToken };
  }

  @Get('/google')
  @ApiOperation({
    summary: '구글 로그인 페이지',
    description: '구글 로그인 페이지',
  })
  async googleAuth(@Res() res: Response): Promise<void> {
    const callbackURL = encodeURIComponent(process.env.GOOGLE_REDIRECT_URI);
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${callbackURL}&response_type=code&scope=profile&access_type=offline&prompt=consent`;
    res.redirect(url);
  }

  @Get('/google/token')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: '구글 인증',
    description: '구글 인증',
  })
  @ApiQuery({
    name: 'code',
    type: String,
    required: true,
    description: '구글 인증 코드',
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      example: {
        accessToken: 'access_token',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async googleAuthCallBack(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.tokenService.getJwtToken(
      req.user,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.REFRESH_TOKEN_SECURE === 'true',
      sameSite: process.env.REFRESH_TOKEN_SAMESITE as 'lax' | 'strict' | 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1w
    });

    return { accessToken };
  }

  @Get('/refresh-token')
  @ApiOperation({
    summary: '토큰 갱신',
    description: '토큰 갱신',
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      example: {
        accessToken: 'new_access_token',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async refreshAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token이 없습니다.');
    }
    const accessToken = await this.tokenService.getNewAccessToken(refreshToken);
    return { accessToken };
  }
}
