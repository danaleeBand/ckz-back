import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { Auth } from './auth/auth.entity';
import { CommonModule } from './common.module';
import { SidebarController } from './sidebar/sidebar.controller';
import { SidebarService } from './sidebar/sidebar.service';
import { WorkspaceService } from './workspace/services/workspace.service';
import { WorkspaceModule } from './workspace/workspace.module';
import { FolderService } from './folder/folder.service';
import { FolderModule } from './folder/folder.module';
import { ChecklistModule } from './checklist/checklist.module';
import { ChecklistItemService } from './checklist-item/checklist_item.service';
import { WorkspaceUserService } from './workspace/services/workspace_user.service';
import { SidebarModule } from './sidebar/sidebar.module';
import { ChecklistItemModule } from './checklist-item/checklist_item.module';
import { ChecklistService } from './checklist/checklist.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'checkuiz',
      logging: 'all',
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: false,
      migrationsRun: false,
      migrations: [`${__dirname}/../migrations/*.ts`],
      migrationsTableName: 'migrations',
    }),
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({}),
    CommonModule,
    WorkspaceModule,
    FolderModule,
    ChecklistModule,
    SidebarModule,
    ChecklistItemModule,
  ],
  controllers: [AppController, AuthController, SidebarController],
  providers: [
    AppService,
    UserService,
    AuthService,
    WorkspaceService,
    WorkspaceUserService,
    SidebarService,
    FolderService,
    ChecklistService,
    ChecklistItemService,
  ],
})
export class AppModule {}
