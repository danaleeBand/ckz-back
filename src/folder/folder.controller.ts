import {
  Body,
  Controller,
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

@Controller('folder')
@ApiTags('폴더')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '폴더 생성',
    description: '폴더를 생성합니다.',
  })
  async createFolder(
    @Req() req,
    @Param('workspaceId') workspaceId: number,
    @Body() createFolderDto: CreateFolderDto,
  ) {
    const { name } = createFolderDto;
    return this.folderService.createFolder(workspaceId, name);
  }

  @Patch('/:folderId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
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
}
