import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {AuthGuard} from "@nestjs/passport";

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
  async getMyInfo(@Req() req) {
    return '통과';
  }
}
