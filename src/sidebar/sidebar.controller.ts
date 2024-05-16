import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SidebarService } from './sidebar.service';

@ApiTags('사이드바')
@Controller('/sidebar')
export class SidebarController {
  constructor(private readonly sidebarService: SidebarService) {}

  @Get('/tree')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '사이드바 트리 조회',
    description: '사이드바 트리 조회',
  })
  @ApiOkResponse({
    description: '사용자의 체크리스트를 사이드바 트리구조로 조회한다.',
    schema: {
      example: {
        workspace: [
          {
            id: 0,
            name: 'string',
            defaultFolder: [
              {
                id: 0,
                title: 'string',
              },
              {
                id: 0,
                title: 'string',
              },
            ],
            folder: [
              {
                id: 0,
                name: 'string',
                checklist: [
                  {
                    id: 0,
                    title: 'string',
                  },
                  {
                    id: 0,
                    title: 'string',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  })
  async getCheckListTree(@Req() req) {
    const userId = req.user.id;
    return this.sidebarService.findSidebarTree(userId);
  }
}
