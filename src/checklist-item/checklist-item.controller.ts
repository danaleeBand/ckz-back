import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChecklistItemService } from './checklist-item.service';
import { CreateChecklistItemDto } from './dtos/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dtos/update-checklist-item.dto';

@ApiTags('체크리스트 항목')
@Controller('checklists/:checklistId/items')
export class ChecklistItemController {
  constructor(private readonly checklistItemService: ChecklistItemService) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '체크리스트 항목 조회',
    description: '체크리스트 항목을 조회합니다.',
  })
  async getChecklistItems(@Param('checklistId') checklistId: number) {
    return this.checklistItemService.getChecklistItems(checklistId);
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '체크리스트 항목 생성',
    description: '체크리스트 항목을 생성합니다.',
  })
  async createChecklistItem(
    @Param('checklistId') checklistId: number,
    @Body() createChecklistItemDto: CreateChecklistItemDto,
  ) {
    const { title } = createChecklistItemDto;
    return this.checklistItemService.createChecklistItem(checklistId, title);
  }

  @Patch('/:checklistItemId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
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
