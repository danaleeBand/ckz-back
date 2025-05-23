import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WorkspaceService } from './services/workspace.service';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceDto } from './dtos/workspace.dto';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { UpdateWorkspaceDto } from './dtos/update-workspace.dto';

@Controller('workspace')
@ApiTags('워크스페이스')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('/')
  @ApiOperation({
    summary: '워크스페이스 모두 조회',
    description: '워크스페이스를 모두 조회합니다.',
  })
  @ApiOkResponse({ description: '성공', type: [WorkspaceDto] })
  @HttpCode(HttpStatus.OK)
  async getWorkspaces(@Req() req): Promise<Array<Workspace>> {
    const { user } = req;
    return this.workspaceService.getWorkspaces(user.id);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '워크스페이스 상세 조회',
    description: '워크스페이스를 상세 조회합니다.',
  })
  @ApiOkResponse({ description: '성공', type: WorkspaceDto })
  @HttpCode(HttpStatus.OK)
  async getWorkspace(@Param('id') id: number): Promise<Workspace> {
    return this.workspaceService.getWorkspace(id);
  }

  @Post('/')
  @ApiOperation({
    summary: '워크스페이스 생성',
    description: '워크스페이스를 생성',
  })
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(
    @Req() req,
    @Body() dto: CreateWorkspaceDto,
  ): Promise<void> {
    const { user } = req;
    return this.workspaceService.createWorkspaceWithPermission(user.id, dto);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: '워크스페이스 수정',
    description: '워크스페이스를 수정',
  })
  @HttpCode(HttpStatus.CREATED)
  async updateWorkspace(
    @Param('id') id: number,
    @Body() dto: UpdateWorkspaceDto,
  ): Promise<void> {
    return this.workspaceService.updateWorkspace(id, dto);
  }
}
