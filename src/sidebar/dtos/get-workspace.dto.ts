import { ApiProperty } from '@nestjs/swagger';
import { GetDefaultFolderDto } from './get-default-folder.dto';
import { GetFolderDto } from './get-folder.dto';

export class GetWorkspaceDto {
  @ApiProperty({
    description: '워크스페이스 ID',
    example: 0,
  })
  id: number;

  @ApiProperty({
    description: '워크스페이스 이름',
    example: '워크스페이스 이름',
  })
  name: string;

  @ApiProperty({
    description: '기본 폴더',
    type: GetDefaultFolderDto,
  })
  defaultFolder: GetDefaultFolderDto;

  @ApiProperty({
    description: '폴더 목록',
    type: [GetFolderDto],
  })
  folders: Array<GetFolderDto>;
}
