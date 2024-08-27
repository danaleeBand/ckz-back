import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChecklistItemService } from './checklist-item.service';
import { CreateChecklistItemDto } from './dtos/create-checklist-item.dto';

@ApiTags('체크리스트 항목')
@Controller('checklist-item')
export class ChecklistItemController {
  constructor(private readonly checklistItemService: ChecklistItemService) {}

  @Get('/:checklistId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '체크리스트 항목 조회',
    description: '체크리스트 항목을 조회합니다.',
  })
  async getChecklistItems(@Param('checklistId') checklistId: number) {
    return this.checklistItemService.getChecklistItems(checklistId);
  }

  @Post('/:checklistId')
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
}
