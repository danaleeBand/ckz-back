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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dtos/create-checklist.dto';
import { UpdateChecklistDto } from './dtos/update-checklist.dto';

@Controller('checklists')
@ApiTags('체크리스트')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Post()
  @ApiOperation({
    summary: '체크리스트 생성',
    description: '체크리스트를 생성합니다.',
  })
  async createChecklist(
    @Req() req,
    @Body() createChecklistDto: CreateChecklistDto,
  ) {
    const { folderId, title } = createChecklistDto;
    return this.checklistService.createChecklist(folderId, title);
  }

  @Patch('/:checklistId')
  @ApiOperation({
    summary: '체크리스트 수정',
    description: '체크리스트를 수정합니다.',
  })
  async updateChecklist(
    @Req() req,
    @Param('checklistId') checklistId: number,
    @Body() updateChecklistDto: UpdateChecklistDto,
  ) {
    return this.checklistService.updateChecklist(
      checklistId,
      updateChecklistDto,
    );
  }

  @Delete('/:checklistId')
  @ApiOperation({
    summary: '체크리스트 삭제',
    description: '체크리스트를 삭제합니다.',
  })
  async deleteChecklist(@Req() req, @Param('checklistId') checklistId: number) {
    return this.checklistService.deleteChecklist(checklistId);
  }
}
