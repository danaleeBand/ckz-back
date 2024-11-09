import { ApiProperty } from '@nestjs/swagger';

export class GetChecklistDto {
  @ApiProperty({
    description: '체크리스트 ID',
    example: 0,
  })
  id: number;

  @ApiProperty({
    description: '체크리스트 제목',
    example: '체크리스트 제목',
  })
  title: string;
}

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
  checklists: GetChecklistDto[];
}

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
  checklists: GetChecklistDto[];
}

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
  folders: GetFolderDto[];
}

export class GetSidebarDto {
  @ApiProperty({
    description: '워크스페이스 목록',
    type: [GetWorkspaceDto],
  })
  workspaces: GetWorkspaceDto[];
}
