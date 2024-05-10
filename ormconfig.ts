import { DataSource } from 'typeorm';
import { User } from './src/user/user.entity';
import { CreateUser1713366146080 } from './src/migrations/1713366146080-create-user';
import { Auth } from './src/auth/auth.entity';
import { CreateAuth1713369213223 } from './src/migrations/1713369213223-create-auth';
import { Workspace } from './src/workspace/workspace.entity';
import { CreateWorkspace1713627752625 } from './src/migrations/1713627752625-create-workspace';
import { UserWorkspace } from './src/workspace/user-workspace.entity';
import { CreateUserWorkspace1713628904253 } from './src/migrations/1713628904253-create-user-workspace';
import { Folder } from './src/folder/folder.entity';
import { CreateFolder1713629509672 } from './src/migrations/1713629509672-create-folder';
import { Checklist } from './src/checklist/checklist.entity';
import { CreateCheklist1713633949678 } from './src/migrations/1713633949678-create-cheklist';
import { ChecklistItem } from './src/checklist/checklist-item.entity';
import { CreateChecklistItem1713677968487 } from './src/migrations/1713677968487-create-checklist-item';
import { AddIsCheckyColumnToUser1713971629982 } from './src/migrations/1713971629982-add-is-checky-column-to-user';
import {AddIsDefaultToFolder1715343575657} from "./src/migrations/1715343575657-add-is-default-to-folder";

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
    UserWorkspace,
    Folder,
    Checklist,
    ChecklistItem,
  ],
  migrations: [
    CreateUser1713366146080,
    CreateAuth1713369213223,
    CreateWorkspace1713627752625,
    CreateUserWorkspace1713628904253,
    CreateFolder1713629509672,
    CreateCheklist1713633949678,
    CreateChecklistItem1713677968487,
    AddIsCheckyColumnToUser1713971629982,
    AddIsDefaultToFolder1715343575657,
  ],
});
