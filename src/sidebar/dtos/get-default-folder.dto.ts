import { ApiProperty } from '@nestjs/swagger';
import { GetChecklistDto } from './get-checklist.dto';

export class GetDefaultFolderDto {
  @ApiProperty({
    description: '기본 폴더 ID',
    example: 0,
  })
  id: number;

  @ApiProperty({
    description: '체크리스트 목록',
    type: [GetChecklistDto],
  })
  checklists: Array<GetChecklistDto>;
}
