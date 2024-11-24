import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dtos/create-folder.dto';
import { UpdateFolderDto } from './dtos/update-folder.dto';

@Controller('folders')
@ApiTags('폴더')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  @ApiOperation({
    summary: '폴더 생성',
    description: '폴더를 생성합니다.',
  })
  async createFolder(@Req() req, @Body() createFolderDto: CreateFolderDto) {
    const { workspaceId, name } = createFolderDto;
    return this.folderService.createFolderInWorkspace(workspaceId, name);
  }

  @Patch('/:folderId')
  @ApiOperation({
    summary: '폴더 수정',
    description: '폴더를 수정합니다.',
  })
  async updateFolder(
    @Req() req,
    @Param('folderId') folderId: number,
    @Body() updateFolderDto: UpdateFolderDto,
  ) {
    return this.folderService.updateFolder(folderId, updateFolderDto);
  }

  @Delete('/:folderId')
  @ApiOperation({
    summary: '폴더 삭제',
    description: '폴더를 삭제합니다.',
  })
  async deleteFolder(@Req() req, @Param('folderId') folderId: number) {
    return this.folderService.deleteFolder(folderId);
  }
}
