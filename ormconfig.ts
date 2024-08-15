import { DataSource } from 'typeorm';
import { User } from './src/user/user.entity';
import { Auth } from './src/auth/auth.entity';
import { Workspace } from './src/workspace/entities/workspace.entity';
import { WorkspaceUser } from './src/workspace/entities/workspace-user.entity';
import { Folder } from './src/folder/folder.entity';
import { Checklist } from './src/checklist/checklist.entity';
import { ChecklistItem } from './src/checklist-item/checklist_item.entity';
import { Permission } from './src/permission/permission.entity';
import { CreateCheckuizTable1722603380677 } from './src/migrations/1722603380677-create-checkuiz-table';
import { AddPermissionCodeColumn1723713179055 } from './src/migrations/1723713179055-add-permission-code-column';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: 'checkuiz',
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: 'migrations',
  entities: [
    User,
    Auth,
    Workspace,
    WorkspaceUser,
    Folder,
    Checklist,
    ChecklistItem,
    Permission,
  ],
  migrations: [
    CreateCheckuizTable1722603380677,
    AddPermissionCodeColumn1723713179055,
  ],
});
