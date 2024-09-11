import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('사용자')
@Controller('/users')
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
        name: '체키',
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

  @Patch('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '내 정보 수정',
    description: '내 정보 수정',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: '체키' },
        profile_image_url: { type: 'string', example: '이미지 url' },
      },
      required: ['user_name', 'profile_image_url'],
    },
  })
  @ApiOkResponse({ description: '성공적으로 사용자 정보가 수정되었습니다.' })
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    await this.userService.updateUser(userId, updateUserDto);
  }
}
