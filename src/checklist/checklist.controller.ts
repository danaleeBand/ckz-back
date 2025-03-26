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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dtos/create-checklist.dto';
import { UpdateChecklistDto } from './dtos/update-checklist.dto';
import { ChangeChecklistOrderDto } from './dtos/change-checklist-order.dto';

@Controller('checklists')
@ApiTags('체크리스트')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get('/:checklistId')
  @ApiOperation({
    summary: '체크리스트 상세 조회',
    description: '체크리스트 상세 조회',
  })
  async getChecklist(@Param('checklistId') checklistId: number) {
    return this.checklistService.getChecklistDetail(checklistId);
  }

  @Post()
  @ApiOperation({
    summary: '체크리스트 생성',
    description: '체크리스트를 생성합니다.',
  })
  async createChecklist(
    @Req() req,
    @Body() createChecklistDto: CreateChecklistDto,
  ) {
    const { user } = req;
    const { folderId, title, emoji } = createChecklistDto;
    return this.checklistService.createChecklist(user, folderId, title, emoji);
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
    const { user } = req;

    return this.checklistService.updateChecklist(
      user,
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

  @Post('/:checklistId')
  @ApiOperation({
    summary: '체크리스트 순서 변경',
    description: '체크리스트 순서를 변경합니다.',
  })
  async changeChecklistOrder(
    @Param('checklistId') checklistId: number,
    @Body() changeChecklistOrderDto: ChangeChecklistOrderDto,
  ) {
    return this.checklistService.changeChecklistOrder(
      Number(checklistId),
      changeChecklistOrderDto,
    );
  }
}
