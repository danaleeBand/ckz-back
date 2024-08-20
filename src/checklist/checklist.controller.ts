import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dtos/create-checklist.dto';

@ApiTags('체크리스트')
@Controller('checklist')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
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
}
