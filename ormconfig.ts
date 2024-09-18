import { DataSource } from 'typeorm';
import { User } from './src/user/user.entity';
import { Auth } from './src/auth/entities/auth.entity';
import { Workspace } from './src/workspace/entities/workspace.entity';
import { WorkspaceUser } from './src/workspace/entities/workspace-user.entity';
import { Folder } from './src/folder/folder.entity';
import { Checklist } from './src/checklist/checklist.entity';
import { ChecklistItem } from './src/checklist-item/checklist-item.entity';
import { Permission } from './src/permission/permission.entity';
import { CreateCheckuiz1723716957910 } from './src/migrations/1723716957910-create-checkuiz';
import { AlterChecklistTable1723717561735 } from './src/migrations/1723717561735-alter-checklist-table';

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
  migrations: [CreateCheckuiz1723716957910, AlterChecklistTable1723717561735],
});
