import { ApiProperty } from '@nestjs/swagger';
import { GetChecklistDto } from './get-checklist.dto';
import { GetFolderDto } from '../../folder/dtos/get-folder.dto';
import { WorkspaceDto } from '../../workspace/dtos/workspace.dto';
import { GetChecklistItemDto } from '../../checklist-item/dtos/get-checklist-item.dto';

export class GetChecklistDetailDto {
  @ApiProperty({ type: GetChecklistDto })
  checklist: GetChecklistDto;

  @ApiProperty({ type: GetFolderDto })
  folder: GetFolderDto;

  @ApiProperty({ type: WorkspaceDto })
  workspace: WorkspaceDto;

  @ApiProperty({ type: [GetChecklistItemDto] })
  items: [GetChecklistItemDto];
}
