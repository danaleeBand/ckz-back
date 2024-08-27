import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChecklistItemService } from './checklist-item.service';

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
}
