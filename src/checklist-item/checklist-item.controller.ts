import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChecklistItemService } from './checklist-item.service';
import { CreateChecklistItemDto } from './dtos/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dtos/update-checklist-item.dto';

@Controller('checklists/:checklistId/items')
@ApiTags('체크리스트 항목')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ChecklistItemController {
  constructor(private readonly checklistItemService: ChecklistItemService) {}

  @Get('')
  @ApiOperation({
    summary: '체크리스트 항목 조회',
    description: '체크리스트 항목을 조회합니다.',
  })
  async getChecklistItems(@Param('checklistId') checklistId: number) {
    return this.checklistItemService.getChecklistItems(checklistId);
  }

  @Post('')
  @ApiOperation({
    summary: '체크리스트 항목 생성',
    description: '체크리스트 항목을 생성합니다.',
  })
  async createChecklistItem(
    @Req() req,
    @Param('checklistId') checklistId: number,
    @Body() createChecklistItemDto: CreateChecklistItemDto,
  ) {
    const { title, memo, emoji } = createChecklistItemDto;
    const { user } = req;
    return this.checklistItemService.createChecklistItem(
      user,
      checklistId,
      title,
      memo,
      emoji,
    );
  }

  @Patch('/:checklistItemId')
  @ApiOperation({
    summary: '체크리스트 항목 수정',
    description: '체크리스트 항목을 수정합니다. - title 필수',
  })
  async updateChecklistItem(
    @Param('checklistId') checklistId: number,
    @Param('checklistItemId') checklistItemId: number,
    @Body() updateChecklistItemDto: UpdateChecklistItemDto,
  ) {
    return this.checklistItemService.updateChecklistItem(
      checklistItemId,
      updateChecklistItemDto,
    );
  }

  @Delete('/:checklistItemId')
  @ApiOperation({
    summary: '체크리스트 항목 삭제',
    description: '체크리스트 항목을 삭제합니다.',
  })
  async deleteChecklistItem(
    @Param('checklistId') checklistId: number,
    @Param('checklistItemId') checklistItemId: number,
  ) {
    return this.checklistItemService.deleteChecklistItem(checklistItemId);
  }
}
