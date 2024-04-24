import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@ApiTags('사용자')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '내 정보 조회',
    description: '내 정보 조회',
  })
  @ApiOkResponse({
    description: '성공적으로 사용자 정보를 가져옴',
    schema: {
      example: {
        name: '사용자 이름',
        profile_image_url: '프로필 이미지 url',
        is_checky: true,
      },
    },
  })
  async getUser(@Req() req) {
    const userId = req.user.id;
    const user = this.userService.findOneUser(userId);
    return user;
  }
}
