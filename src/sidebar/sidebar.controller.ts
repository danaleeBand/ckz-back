import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SidebarService } from './sidebar.service';
import { GetSidebarDto } from './dtos/get-sidebar.dto';

@Controller('/sidebar')
@ApiTags('사이드바')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class SidebarController {
  constructor(private readonly sidebarService: SidebarService) {}

  @Get('/tree')
  @ApiOperation({
    summary: '사이드바 트리 조회',
    description: '사이드바 트리 조회',
  })
  @ApiOkResponse({
    description: '사용자의 체크리스트를 사이드바 트리구조로 조회한다.',
    type: GetSidebarDto,
  })
  async getCheckListTree(@Req() req) {
    const userId = req.user.id;
    return this.sidebarService.getSidebarTree(userId);
  }
}
