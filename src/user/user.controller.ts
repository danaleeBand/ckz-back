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
import { GetUserDto } from './dtos/get-user.dto';

@Controller('/users')
@ApiTags('사용자')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({
    summary: '내 정보 조회',
    description: '내 정보 조회',
  })
  @ApiOkResponse({ description: '성공', type: GetUserDto })
  async getUser(@Req() req) {
    const userId = req.user.id;
    const user = this.userService.findOneUser(userId);
    return user;
  }

  @Patch('/')
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
