import { ApiProperty } from '@nestjs/swagger';
import { GetWorkspaceDto } from './get-workspace.dto';

export class GetSidebarDto {
  @ApiProperty({
    description: '워크스페이스 목록',
    type: [GetWorkspaceDto],
  })
  workspaces: Array<GetWorkspaceDto>;
}
