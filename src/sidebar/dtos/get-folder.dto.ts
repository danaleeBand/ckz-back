import { ApiProperty } from '@nestjs/swagger';
import { GetChecklistDto } from './get-checklist.dto';

export class GetFolderDto {
  @ApiProperty({
    description: '폴더 ID',
    example: 0,
  })
  id: number;

  @ApiProperty({
    description: '폴더 이름',
    example: '폴더 이름',
  })
  name: string;

  @ApiProperty({
    description: '체크리스트 목록',
    type: [GetChecklistDto],
  })
  checklists: Array<GetChecklistDto>;
}
